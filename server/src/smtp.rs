use mail_builder::MessageBuilder;
use mail_send::SmtpClientBuilder;
use actix_web::HttpResponse;
use dotenv::dotenv;

const SENDER: &str = "sr03233022@student.ku.edu.np";

pub struct EmailSender {
    pub smtp_server: String,
    pub smtp_port: u16,
    pub sender_password: String,
}

impl EmailSender {
    pub fn new() -> EmailSender {
        dotenv().ok();
        let password = std::env::var("PASSWORD").unwrap();


        EmailSender {
            smtp_server: String::from("smtp.gmail.com"),
            smtp_port:587,
            sender_password: password,
        }
    }

    pub async fn send_email(&self, subject: &str, body: &str) -> HttpResponse {
        dotenv().ok();
        let password = std::env::var("PASSWORD").unwrap();

        let message = MessageBuilder::new()
            .from(SENDER)
            .to( vec![
                    "sabinranabhat723@gmail.com",
                    "sabinonweb7@gmail.com"
            ])
            .subject(subject)
            .text_body(body);
    
        let mail_result = SmtpClientBuilder::new("smtp.gmail.com", 587)
            .implicit_tls(false)
            .credentials(("sr03233022@student.ku.edu.np", {&password[..]}))
            .connect()
            .await
            .unwrap()
            .send(message)
            .await;

        match mail_result {
            Ok(_) => return HttpResponse::Ok().json("Mail Sent"),
            Err(err) => return HttpResponse::InternalServerError().json(format!("Couldn't send mail {}", err))  
        }
    }
}
