## Airdrop simple script

### Usage

1. Run `npm i` inside the repo.
2. Prepare a list of addresses along with amount that you want to send

```
[
  {
    "publickey": "01f6ee89ac9aca3b01ee2e33efdbe899ff89b38d2dc7fd2bac7b1f62fdd490f3f2",
    "amount": "2500000000"
  },
  {
    "publickey": "014c367075af8611f438660dc77f2470bf18241573379af9db7f13b304cc8414de",
    "amount": "5500000000"
  }
]
```

3. Run script `npm run start [json-list] [Ed25519 PrivateKey] [Network Name] [NodeUrl] [Timeout Value]`

eg `npm run start ./temp/list.json ./temp/key1/secret_key.pem casper-test http://78.46.32.13:7777/rpc 5`

4. You should see the output like 

```
Sent deploy e780a17f8210a9f18a82339796ef38a0c145b807f3a4d5233f822af5b7783c98 for account 01f6ee89ac9aca3b01ee2e33efdbe899ff89b38d2dc7fd2bac7b1f62fdd490f3f2 - 2500000000 cspr motes
Sent deploy 88980b1a50415e9396f9efc7965ef4429827f969bf7470e33dd7ae3b951c9e46 for account 014c367075af8611f438660dc77f2470bf18241573379af9db7f13b304cc8414de - 5500000000 cspr motes
```
