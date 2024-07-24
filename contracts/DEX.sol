// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DEX {
    IERC20 tokenA;
    IERC20 tokenB;

    uint256 public reverseA;
    uint256 public reverseB;

    constructor(IERC20 _tokenA, IERC20 _tokenB) {
        tokenA = _tokenA;
        tokenB = _tokenB;
    }
    function getTokenABalance() public view returns(uint256) {
        return reverseA;
    }
    function getTokenBBalance() public view returns(uint256) {
        return reverseB;
    }


    function addLiquidity(uint256 amountA, uint256 amountB) external {
        require(tokenA.transferFrom(msg.sender, address(this), amountA));
        require(tokenB.transferFrom(msg.sender, address(this), amountB));
        reverseA += amountA;
        reverseB += amountB;
    }
    function remnoveLiquidity(uint amountA, uint256 amountB) external {
        require(tokenA.transfer(msg.sender, amountA));
        require(tokenB.transfer(msg.sender, amountB));
        reverseA -= amountA;
        reverseB -= amountB;
    }
    function removeAllLiquidity() external {

    }
    function swaptokenAtoB(uint256 amountA) external {
        uint256 getdeltaB = getdelta(amountA, reverseA, reverseB);
        reverseA += amountA;
        reverseB -= getdeltaB;
        require(tokenA.transferFrom(msg.sender, address(this), amountA));
        require(tokenB.transfer(msg.sender, getdeltaB));
    }
    function swaptokenBtoA(uint256 amountB) external {
        uint256 getdeltaA = getdelta(amountB, reverseB, reverseA);
        reverseB += amountB;
        reverseA -= getdeltaA;
        require(tokenB.transferFrom(msg.sender, address(this), amountB));
        require(tokenA.transfer(msg.sender, getdeltaA));
    }
    function getdelta(uint256 amountFee, uint256 reverseIn, uint256 reverseOut) public pure returns(uint256){
        uint256 afterFee = amountFee * 997;
        uint256 numerator = afterFee * reverseOut;
        uint256 denominator = reverseIn * 1000 + afterFee;
        return numerator / denominator;

    }
}