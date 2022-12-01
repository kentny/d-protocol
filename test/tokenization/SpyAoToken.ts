import { ethers } from 'hardhat'
import { SpyAoToken } from '../../typechain-types'

export const deploySpyAoToken = async (): Promise<SpyAoToken> => {
    const SpyAoToken = await ethers.getContractFactory('SpyAoToken')
    const spyAoToken = await SpyAoToken.deploy()

    return spyAoToken
}
