import axios from "axios";

const WHATSAPP_TOKEN =
  process.env.WHATSAPP_TOKEN;

const PHONE_NUMBER_ID =
  process.env.WHATSAPP_PHONE_ID;

export async function sendWhatsAppMessage(
  phone: string,
  message: string
) {
  try {
    await axios.post(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product:
          "whatsapp",

        to: phone,

        type: "text",

        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,

          "Content-Type":
            "application/json",
        },
      }
    );
  } catch (error) {
    console.error(
      "Erro WhatsApp:",
      error
    );
  }
}