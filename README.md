mac版です<br>
$はターミナルに入力する内容です。<br>
(1) git cloneします。<br>
$ git clone git@github.com:Kitahara43965/nextjs-email-auth.git<br>
<br>
(2) nextjs-email-authディレクトリに移動<br>
$ cd nextjs-email-auth<br>
<br>
(3) nextをインストールします<br>
$ npm install<br>
<br>
(4) mysql起動<br>
$ brew services start mysql<br>
<br>
(5) プロジェクト直下に.envファイルを作成します。.envファイルに下記を記載します。<br>
DATABASE_URL="mysql://root:password@localhost:3306/auth_app"<br>
NEXTAUTH_SECRET=<br>
NEXTAUTH_URL=http://localhost:3000<br>
<br>
SMTP_HOST=localhost<br>
SMTP_PORT=1025<br>
SMTP_USER=test@example.com<br>
SMTP_PASS=<br>
ここで、NEXTAUTH_SECRETの値は<br>
$ openssl rand -base64 32<br>
と入力して値を取得します。<br>
NEXTAUTH_SECRET="(取得した値)"<br>
とします。<br>
<br>
(6) prismaバージョン変更(prisma ver 5)<br>
npm uninstall prisma @prisma/client<br>
npm install prisma@5 @prisma/client@5<br>
<br>
(7) データ初期化<br>
$ npx prisma migrate reset<br>
で初期化します。<br>
Are you sure you want to reset your database? All data will be lost.<br>
の質問には小文字でyと入力します。<br>
<br>
(8) nodemailerインストール<br>
$ npm install nodemailer<br>
$ npm install -D @types/nodemailer<br>
<br>
(9) サーバー立ち上げ <br>
$ rm -rf .next<br>
$ npm run dev<br>
でサーバーを立ち上げます。<br>
<br>
(10) mailhog起動のために別途terminalを立ち上げる<br>
現在のプロジェクト直下(名称を変更していなければnextjs-email-auth)で<br>
mailhogをインストールしていない場合はbrew経由でインストール<br>
$ brew install go<br>
$ go install github.com/mailhog/MailHog@latest<br>
$ export PATH=$PATH:$(go env GOPATH)/bin<br>
以下のコマンドでmailhog立ち上げ<br>
$ mailhog<br>
<br>
登録画面：localhost:3000/register<br>
ログイン画面： localhost:3000/login<br>
ダッシュボード画面：localhost:3000/dashboard<br>
mailhogメール受信画面: localhost:8025<br>
