// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library ReserveType {
    struct Data {
        address aoToken;                 // TODO: Should restrict with the AoToken interface.
        address debtToken;               // TODO: Should restrict with the DebtToken interface.
        address interestRateProvider;    // TODO: Should restrict with the IInterestRateProvider interface.
    }
}