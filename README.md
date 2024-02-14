# Savings Contract

This Solidity smart contract allows users to deposit, withdraw, and transfer ether from their savings account to any address. It provides a simple and secure way for users to manage their savings on the Ethereum blockchain.

## Features

- **Deposit**: Users can deposit ether into their savings account.
- **Withdraw**: Users can withdraw ether from their savings account.
- **Transfer**: Users can transfer ether from their savings account to any Ethereum address.

## Requirements

- Node.js
- Hardhat
- Solidity
- Ethereum network (e.g., Ganache, Ropsten, Mainnet)

## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/Signor1/savings-contract.git
    ```

2. Navigate to the project directory:

    ```bash
    cd savings-contract
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

## Usage

1. Compile the contracts:

    ```bash
    npx hardhat compile
    ```

2. Run unit tests:

    ```bash
    npx hardhat test
    ```

3. Deploy the contract to an Ethereum network:

    ```bash
    npx hardhat run scripts/deploy.js --network <network-name>
    ```

## Testing

Unit tests are located in the `test` directory. You can run tests using Hardhat's testing framework.

```bash
npx hardhat test
```

## Contributing

Contributions are welcome! If you find any issues or want to add new features, feel free to open an issue or submit a pull request.

