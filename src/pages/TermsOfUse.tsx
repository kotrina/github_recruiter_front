import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function TermsOfUse() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-3xl font-bold mb-2">Términos de Uso / Terms of Use</h1>
        <p className="text-muted-foreground mb-6">
          Use conditions and limitations of liability for Hermes.
        </p>

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">🇪🇸 Términos de Uso</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Última actualización: noviembre de 2025
              </p>
              <p className="mb-4">
                Hermes es una herramienta experimental creada para ayudar a recruiters a interpretar perfiles y repositorios de GitHub. Al usar esta aplicación, aceptas estas condiciones:
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">1. Uso del servicio</h3>
                  <p>
                    Hermes se ofrece "tal cual" (as is), sin garantías de ningún tipo. Los análisis generados por inteligencia artificial tienen fines informativos y no constituyen evaluaciones profesionales ni decisiones de contratación.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">2. Responsabilidad del usuario</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Solo puedes analizar perfiles públicos de GitHub.</li>
                    <li>No está permitido introducir, subir o tratar datos personales de terceros.</li>
                    <li>Eres responsable del uso que hagas de los resultados generados.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">3. Limitaciones de responsabilidad</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Hermes no garantiza la precisión, actualidad o completitud de la información mostrada.</li>
                    <li>No nos hacemos responsables de decisiones o daños derivados del uso de los análisis.</li>
                    <li>El servicio se usa bajo tu propia responsabilidad.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">4. Cambios y disponibilidad</h3>
                  <p>
                    Podemos cambiar, actualizar o interrumpir temporalmente el servicio sin previo aviso. También podemos modificar estos términos; la fecha de actualización indicará la última versión vigente.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">5. Propiedad intelectual</h3>
                  <p>
                    El código, el diseño y los contenidos de Hermes son propiedad de su autor, salvo donde se indique lo contrario. Las marcas y logotipos de GitHub y Google pertenecen a sus respectivos titulares.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">6. Uso aceptable</h3>
                  <p>
                    Queda prohibido el abuso del servicio (p. ej., automatizaciones masivas, intentos de eludir límites, uso que vulnere derechos de terceros o la ley aplicable).
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">7. Contacto</h3>
                  <p>
                    Para consultas sobre el servicio o estos términos, escribe a:<br />
                    📧 raulcotrina@gmail.com
                  </p>
                </div>
              </div>
            </section>

            <hr className="my-8" />

            <section>
              <h2 className="text-xl font-semibold mb-3">🇬🇧 Terms of Use</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Last updated: November 2025
              </p>
              <p className="mb-4">
                Hermes is an experimental tool created to help recruiters interpret GitHub profiles and repositories. By using this application, you accept these conditions:
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">1. Use of the service</h3>
                  <p>
                    Hermes is provided "as is," without warranties of any kind. AI-generated analyses are for informational purposes only and do not constitute professional evaluations or hiring decisions.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">2. User responsibility</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>You may only analyze public GitHub profiles.</li>
                    <li>It is not allowed to input, upload, or process personal data of third parties.</li>
                    <li>You are responsible for how you use the generated results.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">3. Limitations of liability</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Hermes does not guarantee the accuracy, timeliness, or completeness of the information displayed.</li>
                    <li>We are not responsible for decisions or damages resulting from the use of the analyses.</li>
                    <li>The service is used at your own risk.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">4. Changes and availability</h3>
                  <p>
                    We may change, update, or temporarily discontinue the service without prior notice. We may also modify these terms; the update date will indicate the latest version in effect.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">5. Intellectual property</h3>
                  <p>
                    Hermes' code, design, and content are owned by the author, unless stated otherwise. GitHub and Google trademarks and logos belong to their respective owners.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">6. Acceptable use</h3>
                  <p>
                    Abuse of the service is prohibited (e.g., mass automation, attempts to bypass limits, use that violates third-party rights or applicable law).
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">7. Contact</h3>
                  <p>
                    For inquiries about the service or these terms, email:<br />
                    📧 raulcotrina@gmail.com
                  </p>
                </div>
              </div>
            </section>
          </div>
        </article>

        <div className="pt-6">
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
