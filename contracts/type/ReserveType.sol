// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {IAoToken} from '../tokenization/IAoToken.sol';

library ReserveType {
    struct Data {
        IAoToken aoToken;                 // TODO: Should restrict with the AoToken interface.
        address debtToken;               // TODO: Should restrict with the DebtToken interface.
        address interestRateProvider;    // TODO: Should restrict with the IInterestRateProvider interface.
        bool isOverCol;
    }
}