import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { Contract } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { ethers } from 'hardhat'
import { LendingPool, SpyAoToken, SpyERC20 } from '../typechain-types'
import { deployDummyContract } from './misc/DummyContract'
import { deploySpyAoToken } from './tokenization/SpyAoToken'
import { deploySpyERC20 } from './tokenization/SpyERC20'

describe('LendingPool', () => {
    let lendingPool: LendingPool
    let owner: SignerWithAddress
    let alice: SignerWithAddress
    let bob: SignerWithAddress
    let spyAoToken: SpyAoToken
    let spyERC20: SpyERC20
    let spyERC20Decimal: number

    const deployLendingPoolFixture = async (): Promise<{
        lendingPool: LendingPool
        owner: SignerWithAddress
        alice: SignerWithAddress
        bob: SignerWithAddress
    }> => {
        const LendingPool = await ethers.getContractFactory('LendingPool')
        const lendingPool = await LendingPool.deploy()

        const [owner, alice, bob] = await ethers.getSigners()

        return { lendingPool, owner, alice, bob }
    }

    const setupReserve = async (
        lendingPool: Contract,
        isOverCol: boolean,
        asset?: Contract,
        aoToken?: Contract,
        debtToken?: Contract,
        interestRateProvider?: Contract
    ) => {
        const _asset = asset !== undefined ? asset : await deployDummyContract()
        const _aoToken = aoToken !== undefined ? aoToken : await deployDummyContract()
        const _debtToken = debtToken !== undefined ? debtToken : await deployDummyContract()
        const _interestRateProvider =
            interestRateProvider !== undefined ? interestRateProvider : await deployDummyContract()

        await lendingPool.setupReserve(
            _asset.address,
            _aoToken.address,
            _debtToken.address,
            _interestRateProvider.address,
            isOverCol
        )

        return {
            isOverCol,
            _asset,
            _aoToken,
            _debtToken,
            _interestRateProvider
        }
    }

    beforeEach(async () => {
        const fixture = await deployLendingPoolFixture()
        lendingPool = fixture.lendingPool
        owner = fixture.owner
        alice = fixture.alice
        bob = fixture.bob

        spyAoToken = await deploySpyAoToken()
        spyERC20 = await deploySpyERC20()

        spyERC20Decimal = await spyERC20.decimals()

        await spyERC20.mint(alice.address, parseUnits('1000', spyERC20Decimal))
        await spyERC20.mint(bob.address, parseUnits('1000', spyERC20Decimal))

        await spyERC20.connect(alice).approve(lendingPool.address, parseUnits('1000', spyERC20Decimal))
        await spyERC20.connect(bob).approve(lendingPool.address, parseUnits('1000', spyERC20Decimal))
    })

    describe('setupReserve', () => {
        it('should create a new reserve', async () => {
            const {
                isOverCol,
                _asset: asset,
                _aoToken: aoToken,
                _debtToken: debtToken,
                _interestRateProvider: interestRateProvider
            } = await setupReserve(lendingPool, true)

            const reserveData = await lendingPool.getReserveData(asset.address)
            expect(reserveData.aoToken).to.equal(aoToken.address)
            expect(reserveData.debtToken).to.equal(debtToken.address)
            expect(reserveData.interestRateProvider).to.equal(interestRateProvider.address)
            expect(reserveData.isOverCol).to.equal(isOverCol)
        })

        describe('Security', () => {
            it('should revert if `asset` is not a contract address', async () => {
                const { lendingPool, alice } = await deployLendingPoolFixture()
                const dummyContract = await deployDummyContract()
                const dummyContractAddress = dummyContract.address

                await expect(
                    lendingPool.setupReserve(
                        alice.address,
                        dummyContractAddress,
                        dummyContractAddress,
                        dummyContractAddress,
                        true
                    )
                ).to.be.revertedWith('Not Contract')
            })
        })
    })

    describe('deposit', () => {
        it('should revert if asset is not registered in reserves', async () => {
            await expect(lendingPool.deposit(spyERC20.address, 1000)).to.be.revertedWith('Not Registered Asset')
        })

        it('should revert if asset does not complient ERC20', async () => {
            const dummyContract = await deployDummyContract()
            await setupReserve(lendingPool, true, dummyContract, spyAoToken)

            await expect(lendingPool.connect(alice).deposit(dummyContract.address, 1000)).to.be.reverted
        })

        it('should increase the reserve balance by the amount of deposited asset', async () => {
            await setupReserve(lendingPool, true, spyERC20, spyAoToken)

            const amount = parseUnits('30', spyERC20Decimal)

            await expect(lendingPool.connect(alice).deposit(spyERC20.address, amount)).to.changeTokenBalances(
                spyERC20,
                [alice, spyAoToken],
                [amount.mul(-1), amount]
            )
        })

        // it('should issue the same amount of AoToken with the deposited asset', () => {
        // })

        describe('Security', () => {
            // TODO
        })
    })

    describe('withdraw', async () => {
        it('should allow external access', async () => {
            await expect(lendingPool.withdraw()).to.not.be.reverted
        })

        describe('Security', () => {
            // TODO
        })
    })
})
