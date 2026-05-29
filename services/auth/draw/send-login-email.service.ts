import { transporter } from "@/lib/mail";

export async function sendLoginEmail(email: string) {
  await transporter.sendMail({
    from: '"My App" <no-reply@example.com>',
    to: email,
    subject: "ログイン通知",
    html: `
      <h2>ログインがありました</h2>

      <p>
        あなたのアカウントにログインがありました。
      </p>

      <p style="color: #666;">
        心当たりがない場合は、すぐにパスワードを変更してください。
      </p>
    `,
  });
}
