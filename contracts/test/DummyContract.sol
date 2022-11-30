// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract DummyContract {
    function f() public pure {
        revert('Must not use this because this is a dummy contract');
    }
}