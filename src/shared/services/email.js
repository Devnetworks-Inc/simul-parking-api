const { config } = require("../../configs/config");
const nodemailer = require('nodemailer')

const username = config.EMAIL_USERNAME;
const pass = config.EMAIL_PASSWORD;
const clientUrl = config.CLIENT_URL;

const sendEmail = async (message) => {

    const { to, first_name, last_name, booking_id } = message

    const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background-color: #f8f8f8; padding: 20px; text-align: center; border-bottom: 3px solid #FB5801;">
        <h1 style="color: #FB5801; margin: 0;">Booking Confirmed!</h1>
      </div>
      
      <div style="padding: 20px;">
        <p>Dear ${first_name || last_name || 'Valued Customer'},</p>
        
        <p>We're pleased to confirm your shuttle booking with Simul Group.</p>
        
        <div style="background-color: #f0f7ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;">
            <strong>Booking Reference: </strong>
            <a href="${clientUrl}/booking?bookingId=${booking_id}" 
               style="color: #FB5801; text-decoration: none;">
              ${booking_id || 'N/A'}
            </a>
          </p>
        </div>
        
        <p>Click on your booking reference above to view your booking details online.</p>
        
        <p>Should you need to modify your booking or have any questions, please don't hesitate to contact us.</p>
        
        <p>Safe travels,</p>
        <p style="font-weight: bold;">The Simul Group Team</p>
      </div>
      
      <div style="background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 14px; color: #666;">
        <p style="margin: 5px 0;">
          <a href="https://simul-group.ch" style="color: #FB5801; text-decoration: none;">simul-group.ch</a> 
          | <a href="mailto:info@simul-group.ch" style="color: #FB5801; text-decoration: none;">info@simul-group.ch</a> 
          | +41 44 222 22 22
        </p>
        <p style="margin: 5px 0;">Pfändwiesenstrasse 15, 8152 Opfikon, Switzerland</p>
      </div>
    </div>
  `;

    let transporter = nodemailer.createTransport({
        host: 'larissa.kreativmedia.ch',
        port: 587,
        auth: {
            user: username,
            pass,
        },
    });

    let info = await transporter.sendMail({
        from: 'no-reply@simul-group.ch',
        to,
        subject: 'Your Simul Parking Booking Confirmation',
        html: body,
        text: `Dear ${first_name || last_name || 'Valued Customer'},
          We're pleased to confirm your shuttle booking with Simul Group.`
        // html: html && html,
        // attachments: attachments && attachments
    });

    return info
}

module.exports = {
    sendEmail
}