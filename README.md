# LivingIn – webbplats

Komplett statisk webbplats med 11 sidor. Alla bilder, typsnitt och sidfiler ligger i paketet.

## Publicera med GitHub Pages
1. Packa upp ZIP-filen.
2. Lägg innehållet i roten av ditt GitHub-repository. index.html och assets ska ligga bredvid varandra.
3. Öppna Settings → Pages. Välj Deploy from a branch, din branch och / (root).
4. Spara. GitHub visar webbplatsens adress när publiceringen är klar.

Inget byggsteg behövs. Behåll filnamnen och mappstrukturen. Alla interna länkar är relativa och fungerar även under ett repositorynamn.

Kontaktformuläret öppnar ett ifyllt mejlförslag i besökarens e-postprogram. Besökaren granskar och skickar själv. Det finns ingen dold formulärtjänst eller databas.

Instagram-delen länkar till LivingIns riktiga profil. Bilderna är företagets originalbilder från deras webbplats, inte ett automatiskt Instagram-flöde. Bildkällor finns i assets/BILDKALLOR.json. Google-betyget är en daterad ögonblicksbild, inte automatiskt uppdaterat.

Typsnitt och licenser finns i assets. Använd bilderna för LivingIns webbplats och med företagets tillstånd.

sitemap.xml, robots.txt och sidornas canonical/og:url pekar på den levererade förhandsvisningsadressen. Ändra dessa till er slutliga domän när ni byter adress. Själva webbplatsen fungerar även innan dessa metadata har bytts.
