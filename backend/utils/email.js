import nodemailer from 'nodemailer';

const createTransporter = () => {
  // For production, use real SMTP (Gmail, SendGrid, etc.)
  // For demo/development, you can use Ethereal or just log
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  // Fallback: create test account (logs only in practice)
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: process.env.ETHEREAL_USER || 'test@ethereal.email',
      pass: process.env.ETHEREAL_PASS || 'test',
    },
  });
};

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Library Management System" <library@college.edu>',
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error.message);
    // In demo mode, still return success so UI works
    return { success: false, error: error.message };
  }
};

export const sendBorrowConfirmation = async (student, book, borrow) => {
  const dueDateStr = new Date(borrow.dueDate).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const subject = `Book Issued: ${book.title} - Due on ${dueDateStr}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f6f9; border-radius: 12px;">
      <h2 style="color: #6c63ff;">📚 Library Book Issued</h2>
      <p>Dear <strong>${student.name}</strong>,</p>
      <p>The following book has been issued to you:</p>
      <div style="background: white; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p><strong>Title:</strong> ${book.title}</p>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Issue Date:</strong> ${new Date(borrow.issueDate).toLocaleDateString('en-IN')}</p>
        <p><strong>Due Date:</strong> <span style="color: #e74c3c; font-weight: bold;">${dueDateStr}</span></p>
        <p><strong>Allowed Days:</strong> ${borrow.daysAllowed} days</p>
      </div>
      <p>Please return or reissue the book on or before the due date to avoid late fees.</p>
      <p style="color: #7f8c8d; font-size: 12px;">— Library Management System</p>
    </div>
  `;
  return sendEmail({ to: student.email, subject, html, text: `Book ${book.title} issued. Due: ${dueDateStr}` });
};

export const sendReminderEmail = async (student, book, borrow) => {
  const daysLeft = Math.ceil((new Date(borrow.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
  const dueDateStr = new Date(borrow.dueDate).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const isOverdue = daysLeft < 0;
  const subject = isOverdue 
    ? `⚠️ OVERDUE: Please return "${book.title}" immediately`
    : `Reminder: Return or Reissue "${book.title}" within ${daysLeft} day(s)`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f6f9; border-radius: 12px;">
      <h2 style="color: ${isOverdue ? '#e74c3c' : '#f39c12'};">${isOverdue ? '⚠️ Book Overdue' : '⏰ Return Reminder'}</h2>
      <p>Dear <strong>${student.name}</strong>,</p>
      <p>${isOverdue 
        ? `Your borrowed book is <strong style="color:#e74c3c;">${Math.abs(daysLeft)} day(s) overdue</strong>. Please return it as soon as possible.`
        : `This is a friendly reminder that your borrowed book is due soon.`}</p>
      <div style="background: white; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p><strong>Title:</strong> ${book.title}</p>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Due Date:</strong> <span style="color: #e74c3c; font-weight: bold;">${dueDateStr}</span></p>
        <p><strong>Days ${isOverdue ? 'Overdue' : 'Remaining'}:</strong> ${Math.abs(daysLeft)}</p>
      </div>
      <p>Please visit the library to <strong>return</strong> or <strong>reissue</strong> the book.</p>
      <p style="color: #7f8c8d; font-size: 12px;">— Library Management System</p>
    </div>
  `;
  return sendEmail({ to: student.email, subject, html, text: subject });
};
