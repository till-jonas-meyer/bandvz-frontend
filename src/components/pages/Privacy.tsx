import {
  Anchor,
  Code,
  Container,
  Divider,
  List,
  Stack,
  Text,
  Title,
} from "@mantine/core";

export function Privacy() {
  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <section>
          <Title order={1}>Datenschutzerklärung</Title>

          <Text c="dimmed" mt="xs">
            Stand: 2. September 2026
          </Text>
        </section>

        <Divider />

        {/* 1 */}
        <section>
          <Title order={2} mb="sm">
            1. Verantwortlicher
          </Title>

          <Stack gap="xs">
            <Text>
              Verantwortlicher für die Verarbeitung personenbezogener Daten im
              Zusammenhang mit dieser Website und Webanwendung ist:
            </Text>

            <Text>
              <strong>Till Jonas Meyer</strong>
              <br />
              Vor dem Dorfe 15
              <br />
              38108 Braunschweig
              <br />
              Deutschland
            </Text>

            <Text>
              E-Mail:{" "}
              <Anchor href="mailto:musik@till-meyer.de">
                musik@till-meyer.de
              </Anchor>
            </Text>
          </Stack>
        </section>

        {/* 2 */}
        <section>
          <Title order={2} mb="sm">
            2. Allgemeines zur Datenverarbeitung
          </Title>

          <Stack gap="sm">
            <Text>
              Der Schutz deiner personenbezogenen Daten ist mir wichtig. Ich
              verarbeite personenbezogene Daten nur, soweit dies zur
              Bereitstellung und zum sicheren Betrieb dieser Webanwendung
              erforderlich ist oder eine andere gesetzliche Grundlage für die
              Verarbeitung besteht.
            </Text>

            <Text>
              Personenbezogene Daten sind alle Informationen, die sich auf eine
              identifizierte oder identifizierbare Person beziehen.
            </Text>
          </Stack>
        </section>

        {/* 3 */}
        <section>
          <Title order={2} mb="sm">
            3. Registrierung und Benutzerkonto
          </Title>

          <Stack gap="sm">
            <Text>
              Bei der Registrierung wird deine{" "}
              <Text span fw={700}>
                E-Mail-Adresse
              </Text>{" "}
              verarbeitet und in der Datenbank gespeichert.
            </Text>

            <Text>
              Die E-Mail-Adresse wird insbesondere dazu verwendet, dein
              Benutzerkonto zu verwalten und dir die Nutzung der Funktionen
              der Webanwendung zu ermöglichen.
            </Text>

            <Text>
              Rechtsgrundlage für die Verarbeitung ist{" "}
              <Text span fw={700}>
                Art. 6 Abs. 1 lit. b DSGVO
              </Text>
              , soweit die Verarbeitung zur Durchführung des
              Nutzungsverhältnisses bzw. zur Bereitstellung des Benutzerkontos
              erforderlich ist.
            </Text>

            <Text>
              Darüber hinaus können gesetzliche Aufbewahrungspflichten oder
              berechtigte Interessen an der sicheren und ordnungsgemäßen
              Verwaltung der Anwendung eine weitere Verarbeitung rechtfertigen.
            </Text>

            <Text>
              Über die E-Mail-Adresse hinaus werden bei der Registrierung nach
              aktuellem Stand keine weiteren personenbezogenen Bestandsdaten
              gezielt erhoben und in der Anwendungsdatenbank gespeichert.
            </Text>
          </Stack>
        </section>

        {/* 4 */}
        <section>
          <Title order={2} mb="sm">
            4. Anmeldung und Authentifizierung
          </Title>

          <Stack gap="sm">
            <Text>
              Zur Authentifizierung wird nach erfolgreicher Anmeldung bzw.
              Registrierung ein{" "}
              <Code>JSON Web Token (JWT)</Code> in einem{" "}
              <Code>HttpOnly-Cookie</Code> gespeichert.
            </Text>

            <Text>
              Das Cookie dient ausschließlich der Authentifizierung und der
              Aufrechterhaltung der angemeldeten Sitzung.
            </Text>

            <Text>
              Da das Cookie mit dem Attribut <Code>HttpOnly</Code> versehen
              ist, kann es grundsätzlich nicht durch clientseitiges JavaScript
              ausgelesen werden.
            </Text>

            <Text>
              Soweit das Cookie ausschließlich für die vom Nutzer gewünschte
              Anmeldung und Authentifizierung erforderlich ist, erfolgt seine
              Speicherung bzw. der Zugriff darauf auf Grundlage von{" "}
              <Text span fw={700}>
                § 25 Abs. 2 Nr. 2 TDDDG
              </Text>
              .
            </Text>

            <Text>
              Die mit dem Cookie verbundene Verarbeitung personenbezogener
              Daten zur Bereitstellung des Benutzerkontos erfolgt auf Grundlage
              von{" "}
              <Text span fw={700}>
                Art. 6 Abs. 1 lit. b DSGVO
              </Text>
              .
            </Text>
          </Stack>
        </section>

        {/* 5 */}
        <section>
          <Title order={2} mb="sm">
            5. Cloudflare Turnstile
          </Title>

          <Stack gap="sm">
            <Text>
              Für den Schutz der Registrierung vor automatisierten Anmeldungen
              und Missbrauch wird{" "}
              <Text span fw={700}>
                Cloudflare Turnstile
              </Text>{" "}
              eingesetzt, ein Dienst der Cloudflare, Inc., 101 Townsend St.,
              San Francisco, CA 94107, USA.
            </Text>

            <Text>
              Turnstile führt im Browser technische Prüfungen durch, um
              zwischen menschlichen Nutzern und automatisierten Zugriffen zu
              unterscheiden.
            </Text>

            <Text>
              Hierbei können technische Signale wie die IP-Adresse,
              TLS-Fingerprint, User-Agent und weitere Browser- bzw.
              Sitzungsmerkmale verarbeitet werden.
            </Text>

            <Text>
              Die Verarbeitung erfolgt zum Zweck des Schutzes der Registrierung
              und der Webanwendung vor Bots, automatisiertem Missbrauch und
              vergleichbaren Angriffen.
            </Text>

            <Text>
              Rechtsgrundlage ist{" "}
              <Text span fw={700}>
                Art. 6 Abs. 1 lit. f DSGVO
              </Text>
              . Das berechtigte Interesse besteht im Schutz der Webanwendung
              und ihrer Nutzer vor missbräuchlichen bzw. automatisierten
              Registrierungen.
            </Text>

            <Text>
              Weitere Informationen zur Datenverarbeitung durch Cloudflare
              findest du in der{" "}
              <Anchor
                href="https://www.cloudflare.com/de-de/privacypolicy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Datenschutzerklärung von Cloudflare
              </Anchor>{" "}
              sowie in der{" "}
              <Anchor
                href="https://www.cloudflare.com/de-de/turnstile-privacy-policy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Datenschutzerklärung für Cloudflare Turnstile
              </Anchor>
              .
            </Text>
          </Stack>
        </section>

        {/* 6 */}
        <section>
          <Title order={2} mb="sm">
            6. Cookies
          </Title>

          <Stack gap="sm">
            <Text>
              Die Webanwendung verwendet ein technisch erforderliches
              HttpOnly-Cookie zur Authentifizierung angemeldeter Nutzer.
            </Text>

            <Text>
              Dieses Cookie dient ausschließlich dazu, die vom Nutzer
              gewünschte Anmeldung bzw. Sitzung zu ermöglichen. Es wird nicht
              zu Werbe- oder Trackingzwecken eingesetzt.
            </Text>

            <Text>
              Soweit die Speicherung des Cookies ausschließlich zur
              Bereitstellung des ausdrücklich gewünschten Dienstes erforderlich
              ist, ist hierfür nach{" "}
              <Text span fw={700}>
                § 25 Abs. 2 Nr. 2 TDDDG
              </Text>{" "}
              keine Einwilligung erforderlich.
            </Text>
          </Stack>
        </section>

        {/* 7 */}
        <section>
          <Title order={2} mb="sm">
            7. Server- und Verbindungsdaten
          </Title>

          <Stack gap="sm">
            <Text>
              Beim Aufruf einer Website bzw. Webanwendung werden technisch
              bedingt Daten verarbeitet, die für die Kommunikation zwischen
              deinem Endgerät und dem Server erforderlich sind.
            </Text>

            <Text>
              Hierzu können insbesondere IP-Adresse, Zeitpunkt des Zugriffs,
              angeforderte Ressource, HTTP-Statuscode sowie technische
              Informationen über den verwendeten Browser gehören.
            </Text>

            <Text>
              Die Verarbeitung erfolgt zur technischen Bereitstellung,
              Stabilität und Sicherheit der Webanwendung und auf Grundlage von{" "}
              <Text span fw={700}>
                Art. 6 Abs. 1 lit. f DSGVO
              </Text>
              .
            </Text>
          </Stack>
        </section>

        {/* 8 */}
        <section>
          <Title order={2} mb="sm">
            8. Empfänger und Dienstleister
          </Title>

          <Stack gap="sm">
            <Text>
              Soweit dies für den Betrieb der Webanwendung erforderlich ist,
              können personenbezogene Daten durch von mir eingesetzte
              technische Dienstleister verarbeitet werden.
            </Text>

            <List spacing="xs">
              <List.Item>
                <Text span fw={700}>
                  Cloudflare, Inc.
                </Text>{" "}
                – Bereitstellung von Cloudflare Turnstile zur Bot-Erkennung.
              </List.Item>

              <List.Item>
                <Text span fw={700}>
                  STRATO AG
                </Text>{" "}
                – Hosting der Webanwendung.
              </List.Item>
            </List>

            <Text>
              Soweit Dienstleister personenbezogene Daten in meinem Auftrag
              verarbeiten, erfolgt dies – soweit erforderlich – auf Grundlage
              eines Auftragsverarbeitungsvertrags gemäß Art. 28 DSGVO.
            </Text>
          </Stack>
        </section>

        {/* 9 */}
        <section>
          <Title order={2} mb="sm">
            9. Übermittlung in Drittländer
          </Title>

          <Stack gap="sm">
            <Text>
              Durch den Einsatz von Cloudflare können personenbezogene Daten
              bzw. technische Informationen auch außerhalb der Europäischen
              Union bzw. des Europäischen Wirtschaftsraums verarbeitet werden.
            </Text>

            <Text>
              Für Einzelheiten zu den von Cloudflare eingesetzten Mechanismen
              für internationale Datenübermittlungen wird auf die{" "}
              <Anchor
                href="https://www.cloudflare.com/de-de/privacypolicy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Datenschutzinformationen von Cloudflare
              </Anchor>{" "}
              verwiesen.
            </Text>
          </Stack>
        </section>

        {/* 10 */}
        <section>
          <Title order={2} mb="sm">
            10. Speicherdauer
          </Title>

          <Stack gap="sm">
            <Text>
              Die E-Mail-Adresse wird gespeichert, solange das Benutzerkonto
              besteht und die Speicherung für die Bereitstellung der
              Webanwendung erforderlich ist.
            </Text>

            <Text>
              Nach Löschung des Benutzerkontos werden die damit verbundenen
              personenbezogenen Daten gelöscht, soweit keine gesetzlichen
              Aufbewahrungspflichten oder andere gesetzliche Gründe einer
              Löschung entgegenstehen.
            </Text>
          </Stack>
        </section>

        {/* 11 */}
        <section>
          <Title order={2} mb="sm">
            11. Deine Rechte
          </Title>

          <Stack gap="sm">
            <Text>
              Du hast gegenüber dem Verantwortlichen grundsätzlich folgende
              Rechte:
            </Text>

            <List spacing="xs">
              <List.Item>
                Recht auf Auskunft gemäß Art. 15 DSGVO
              </List.Item>
              <List.Item>
                Recht auf Berichtigung gemäß Art. 16 DSGVO
              </List.Item>
              <List.Item>
                Recht auf Löschung gemäß Art. 17 DSGVO
              </List.Item>
              <List.Item>
                Recht auf Einschränkung der Verarbeitung gemäß Art. 18 DSGVO
              </List.Item>
              <List.Item>
                Recht auf Datenübertragbarkeit gemäß Art. 20 DSGVO
              </List.Item>
              <List.Item>
                Recht auf Widerspruch gemäß Art. 21 DSGVO
              </List.Item>
            </List>

            <Text>
              Soweit eine Verarbeitung auf deiner Einwilligung beruht, kannst
              du diese Einwilligung jederzeit mit Wirkung für die Zukunft
              widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten
              Verarbeitung bleibt hiervon unberührt.
            </Text>

            <Text>
              Zur Ausübung deiner Rechte kannst du dich an die oben genannte
              Kontaktadresse wenden.
            </Text>
          </Stack>
        </section>

        {/* 12 */}
        <section>
          <Title order={2} mb="sm">
            12. Beschwerderecht bei einer Aufsichtsbehörde
          </Title>

          <Stack gap="sm">
            <Text>
              Du hast das Recht, dich bei einer Datenschutzaufsichtsbehörde
              über die Verarbeitung deiner personenbezogenen Daten zu
              beschweren.
            </Text>

            <Text>
              Insbesondere kannst du dich an die für deinen Wohnort oder den
              Ort des mutmaßlichen Verstoßes zuständige
              Datenschutzaufsichtsbehörde wenden.
            </Text>

            <Text>
              Für Niedersachsen ist grundsätzlich die{" "}
              <Text span fw={700}>
                Landesbeauftragte für den Datenschutz Niedersachsen
              </Text>{" "}
              zuständig.
            </Text>
          </Stack>
        </section>

        {/* 13 */}
        <section>
          <Title order={2} mb="sm">
            13. Datensicherheit
          </Title>

          <Stack gap="sm">
            <Text>
              Ich setze geeignete technische und organisatorische Maßnahmen
              ein, um personenbezogene Daten gegen Verlust, Zerstörung,
              Manipulation, unberechtigten Zugriff und sonstige unberechtigte
              Verarbeitung zu schützen.
            </Text>

            <Text>
              Hierzu gehört unter anderem die Verwendung eines HttpOnly-Cookies
              für die Authentifizierung.
            </Text>

            <Text>
              Die Sicherheitsmaßnahmen werden entsprechend der technischen
              Entwicklung und den betrieblichen Erfordernissen fortlaufend
              überprüft und angepasst.
            </Text>
          </Stack>
        </section>

        {/* 14 */}
        <section>
          <Title order={2} mb="sm">
            14. Änderungen dieser Datenschutzerklärung
          </Title>

          <Stack gap="sm">
            <Text>
              Ich behalte mir vor, diese Datenschutzerklärung anzupassen, wenn
              sich die technische oder rechtliche Situation der Webanwendung
              ändert.
            </Text>

            <Text>
              Es gilt jeweils die zum Zeitpunkt des Besuchs bzw. der Nutzung
              veröffentlichte Fassung.
            </Text>
          </Stack>
        </section>

        <Divider my="md" />

        {/* Impressum */}
        <section>
          <Title order={1} mb="md">
            Impressum
          </Title>

          <Stack gap="xl">
            <div>
              <Title order={2} mb="sm">
                Angaben gemäß § 5 DDG
              </Title>

              <Text>
                <strong>Till Jonas Meyer</strong>
                <br />
                Vor dem Dorfe 15
                <br />
                38108 Braunschweig
                <br />
                Deutschland
              </Text>

              <Text mt="sm">
                <strong>E-Mail:</strong>{" "}
                <Anchor href="mailto:musik@till-meyer.de">
                  musik@till-meyer.de
                </Anchor>
              </Text>
            </div>

            <div>
              <Title order={2} mb="sm">
                Verantwortlich für den Inhalt
              </Title>

              <Text>
                <strong>Till Jonas Meyer</strong>
                <br />
                Vor dem Dorfe 15
                <br />
                38108 Braunschweig
                <br />
                Deutschland
              </Text>
            </div>

            <div>
              <Title order={2} mb="sm">
                Verbraucherstreitbeilegung
              </Title>

              <Stack gap="sm">
                <Text>
                  Die Europäische Kommission stellt eine Plattform zur
                  Online-Streitbeilegung (OS-Plattform) bereit.
                </Text>

                <Text>
                  Ich bin nicht bereit, an Streitbeilegungsverfahren vor einer
                  Verbraucherschlichtungsstelle teilzunehmen.
                </Text>
              </Stack>
            </div>
          </Stack>
        </section>
      </Stack>
    </Container>
  );
}
