import { transporter } from "@/lib/mail";

export async function sendVerificationEmail(
  email: string,
  verifyToken: string,
) {
  const baseUrl = process.env.NEXTAUTH_URL;
  const verifyUrl = `${baseUrl}/api/verify?token=${verifyToken}`;

  await transporter.sendMail({
    from: '"My App" <no-reply@example.com>',
    to: email,
    subject: "メール認証",
    html: `
      <h1>メール認証</h1>

      <p>
        下のボタンを押して認証してください
      </p>

      <a
        href="${verifyUrl}"
        style="
          display:inline-block;
          padding:12px 24px;
          background:#2563eb;
          color:#ffffff;
          text-decoration:none;
          border-radius:8px;
          font-weight:bold;
        "
      >
        メール認証する
      </a>
    `,
  });
}
