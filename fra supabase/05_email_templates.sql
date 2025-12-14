-- =====================================================
-- EMAIL TEMPLATES SEED DATA
-- Eksporteret: 14. december 2025
-- =====================================================

INSERT INTO email_templates (name, description, subject_da, subject_en, subject_de, body_html, trigger_days_before, priority, is_active, include_portal_box) VALUES

-- Welcome email (aktiv)
('welcome_email', 
 'Velkomst email med magic link til gæsteportal',
 'Velkommen til Jelling Camping - Din personlige side',
 'Welcome to Jelling Camping - Your personal page',
 'Willkommen beim Jelling Camping - Ihre persönliche Seite',
 'Kære {{guest_name}},

Vi glæder os utroligt meget til at byde dig velkommen på vores campingplads!
Dit ophold er booket fra {{arrival_date}} til {{departure_date}}, og vi håber, at dagene hos os bliver både afslappende og fulde af gode oplevelser.

På campingpladsen finder du hyggelige omgivelser, rene faciliteter og masser af muligheder for at nyde naturen. Har du spørgsmål før ankomst, eller er der noget, vi kan hjælpe med at forberede, er du altid velkommen til at kontakte os.

Vi ønsker dig en fantastisk ferie – og vi ser frem til at tage imod dig!

De bedste hilsner
Campingpladsen 🌿',
 3, 1, true, true),

-- Check-in reminder (inaktiv)
('checkin_reminder',
 'Påmindelse om check-in dagen før ankomst',
 'I morgen ankommer du til Jelling Camping!',
 'You arrive at Jelling Camping tomorrow!',
 'Morgen kommen Sie beim Jelling Camping an!',
 '<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1>Jelling Camping</h1>
    <p>Vi glaeder os til at se dig i morgen!</p>
  </div>
  <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0;">
    <p>Hej {{FIRST_NAME}},</p>
    <p>Vi minder dig om at du ankommer <strong>i morgen</strong>!</p>
    <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
      <strong>Check-in information:</strong><br>
      Ankomst: {{ARRIVAL_DATE}}<br>
      Plads: {{SPOT_NUMBER}}<br>
      Reception aaben: 08:00-20:00
    </div>
  </div>
</body>
</html>',
 1, 2, false, true),

-- Check-out reminder (inaktiv)
('checkout_reminder',
 'Påmindelse om check-out på afrejsedagen',
 'Tak for dit besøg hos Jelling Camping',
 'Thank you for visiting Jelling Camping',
 'Danke für Ihren Besuch beim Jelling Camping',
 '<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1>Jelling Camping</h1>
    <p>Tak for dit besoeg!</p>
  </div>
  <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0;">
    <p>Kaere {{FIRST_NAME}},</p>
    <p>Vi haaber du har haft et dejligt ophold hos os!</p>
    <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
      <strong>Check-out paemindelse:</strong><br>
      Afrejse: {{DEPARTURE_DATE}}<br>
      Check-out tid: Senest kl. 11:00
    </div>
  </div>
</body>
</html>',
 0, 3, false, true)

ON CONFLICT (name) DO UPDATE SET
  body_html = EXCLUDED.body_html,
  subject_da = EXCLUDED.subject_da,
  subject_en = EXCLUDED.subject_en,
  subject_de = EXCLUDED.subject_de;
