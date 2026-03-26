# BitPay Kiosk Demo - Next.js

This is a demonstration Next.js app to show how BitPay can be used in the
context of a retail kiosk. It utilizes the `Merchant/Payout` facade and with a simple
configuration file you can customize the `posData` fields that are sent to
BitPay. This app uses Prisma to manage the database schema and by default
uses an embedded sqlite database to make it easy to start. Feel free to use other RDBMS like MySQL.

## Functionality

- Create invoices
- View a grid of invoices (`/invoices`)
- View invoice details (`/invoices/:invoiceId`)
- Store invoices in a database
- Receives instant payment notifications (IPN) to update the database
- Uses EventSource to update the frontend upon receiving IPN

## Prerequisites

- BitPay Account
- Node.js >= 20

## Configuration

### Environment Variables

This app can use either a `.env` file or global environment variables. If you
would like to use a `.env` file, you will need to copy `.env.example` to `.env`
and update the values.

### BitPay Config File

Run the setup script:
`node node_modules/bitpay-sdk/dist/setup/BitPaySetup.js`

Follow the on-screen prompts to generate your key and config file. Once the BitPaySetup Script has run and generated the JSON correctly, read the console output and follow the instructions in order to pair your new tokens.

You can find the generated config file and key (if you chose to create a key file) in node_modules/bitpay-sdk/dist/secure/.

Copy generated config file `BitPay.config.json` to `root` of project directory.

### YAML Configuration

| YAML Key                                       | Description                                                                      |
| ---------------------------------------------- | -------------------------------------------------------------------------------- |
| bitpay.design.hero.bgColor                     | CSS color for hero background                                                    |
| bitpay.design.hero.title                       | The title to show in the hero                                                    |
| bitpay.design.hero.body                        | The text to show under the title in the hero                                     |
| bitpay.design.logo                             | URL for the logo                                                                 |
| bitpay.design.posdata.fields                   | See the `POS Data Fields` section below                                          |
| bitpay.design.mode                             | Determines whether the app should be run in `standard` or `donation` mode        |
| bitpay.design.donation.denominations           | Available donations to choose. The highest value determined the maximum donation |
| bitpay.design.donation.enableOther             | Determines whether the app should allow to use own donation value.               |
| bitpay.design.donation.footerText              | The text to show in the footer                                                   |
| bitpay.design.donation.buttonSelectedBgColor   | CSS color for selected donation background                                       |
| bitpay.design.donation.buttonSelectedTextColor | CSS color for selected donation text                                             |
| bitpay.token                                   | Your BitPay token                                                                |
| bitpay.notificationEmail                       | The email you want to use for notifications                                      |
| bitpay.environment                             | BitPay environment ( test / prod )                                               |

### POS Data Fields

#### Dropdown (posData)

| YAML Key      | Description                                            |
| ------------- | ------------------------------------------------------ |
| type          | Set to "select"                                        |
| required      | Determines whether the field should be required or not |
| id            | Field identifier                                       |
| name          | Field name                                             |
| label         | Field label                                            |
| options.id    | (options array) ID for a given selection               |
| options.label | (options array) Label for a given selection            |
| options.value | (options array) Value for a given selection            |

#### Fieldset (posData)

| YAML Key      | Description                                            |
| ------------- | ------------------------------------------------------ |
| type          | Set to "fieldset"                                      |
| required      | Determines whether the field should be required or not |
| name          | Field name                                             |
| label         | Field label                                            |
| options.id    | (options array) ID for a given selection               |
| options.label | (options array) Label for a given selection            |
| options.value | (options array) Value for a given selection            |

#### Text (posData)

| YAML Key | Description                                            |
| -------- | ------------------------------------------------------ |
| type     | Set to "text"                                          |
| required | Determines whether the field should be required or not |
| name     | Field name                                             |
| label    | Field label                                            |

#### Price

| YAML Key | Description                                            |
| -------- | ------------------------------------------------------ |
| type     | Set to "price"                                         |
| required | Determines whether the field should be required or not |
| name     | Field name                                             |
| label    | Field label                                            |
| currency | Currency for the field                                 |

## Running

- `npm install`
- `cp .env.example .env` and configure it
- `cp application.example.yaml application.yaml` and configure it
- Copy generated config file `BitPay.config.json` to `root` of project directory.
- `npm run migrate`
- To start in production mode run `npm run build && npm start`
- To start in development mode run `npm run dev`

## Testing

Run `npm run test`
