import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LegalNotice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Legal Notice / Aviso Legal</h1>
          <p className="text-muted-foreground">Project transparency, author and responsibilities.</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>🇪🇸 Aviso Legal</h2>
          <p className="text-sm text-muted-foreground">Última actualización: noviembre de 2025</p>

          <h3><strong>1. Responsable del servicio</strong></h3>
          <p>
            Hermes es un proyecto experimental desarrollado con fines informativos para ayudar a recruiters a interpretar perfiles técnicos y repositorios de GitHub.<br />
            <strong>Responsable:</strong> Raúl Cotrina (proyecto personal)<br />
            <strong>Contacto:</strong> raulcotrina@gmail.com
          </p>

          <h3><strong>2. Naturaleza del servicio</strong></h3>
          <p>
            Hermes se ofrece "tal cual" (as is), sin garantías de disponibilidad, exactitud o adecuación a un fin concreto.<br />
            Los análisis generados por IA son orientativos y pueden contener imprecisiones.
          </p>

          <h3><strong>3. Propiedad intelectual</strong></h3>
          <p>
            El código, el diseño y los contenidos de Hermes son propiedad de su autor, salvo donde se indique lo contrario.<br />
            GitHub, Google, Gemini y sus logotipos y marcas son propiedad de sus respectivos titulares.
          </p>

          <h3><strong>4. Uso permitido</strong></h3>
          <p>
            El uso de Hermes se limita al análisis de perfiles públicos de GitHub.<br />
            No está permitido introducir, subir o tratar datos personales de terceros.
          </p>

          <h3><strong>5. Tratamiento de datos</strong></h3>
          <p>
            Hermes no almacena información personal ni conserva los resultados de análisis una vez finalizada la sesión.<br />
            Si se utiliza análisis por IA, se ejecuta mediante el modelo Gemini de Google, de acuerdo con sus propios términos y políticas de privacidad.
          </p>

          <h3><strong>6. Limitación de responsabilidad</strong></h3>
          <p>
            El autor no se responsabiliza de decisiones, acciones o daños derivados del uso de los resultados proporcionados por la aplicación.<br />
            El uso del servicio se realiza bajo la responsabilidad del usuario.
          </p>

          <h3><strong>7. Cambios</strong></h3>
          <p>
            Este aviso legal puede actualizarse para reflejar cambios técnicos o normativos.<br />
            La fecha indicada al inicio refleja la última versión vigente.
          </p>

          <h3><strong>8. Contacto</strong></h3>
          <p>Para cualquier consulta, escribe a raulcotrina@gmail.com</p>

          <hr className="my-8" />

          <h2>🇬🇧 Legal Notice</h2>
          <p className="text-sm text-muted-foreground">Last updated: November 2025</p>

          <h3><strong>1. Service owner</strong></h3>
          <p>
            Hermes is an experimental project built to help recruiters interpret technical GitHub profiles and repositories.<br />
            <strong>Owner:</strong> Raúl Cotrina (personal project)<br />
            <strong>Contact:</strong> raulcotrina@gmail.com
          </p>

          <h3><strong>2. Nature of the service</strong></h3>
          <p>
            Hermes is provided "as is," with no warranties of availability, accuracy, or fitness for a particular purpose.<br />
            AI-generated analyses are indicative and may contain inaccuracies.
          </p>

          <h3><strong>3. Intellectual property</strong></h3>
          <p>
            Hermes' code, design, and content are owned by the author, unless stated otherwise.<br />
            GitHub, Google, Gemini and their logos and trademarks belong to their respective owners.
          </p>

          <h3><strong>4. Permitted use</strong></h3>
          <p>
            Hermes is limited to analyzing public GitHub profiles.<br />
            It is not allowed to upload, input, or process personal data of third parties.
          </p>

          <h3><strong>5. Data processing</strong></h3>
          <p>
            Hermes does not store personal information nor keeps analysis results after the session ends.<br />
            If AI analysis is used, it is performed via Google's Gemini model under its own terms and privacy policies.
          </p>

          <h3><strong>6. Limitation of liability</strong></h3>
          <p>
            The author is not responsible for decisions, actions, or damages resulting from the use of the analyses.<br />
            You use the service at your own risk.
          </p>

          <h3><strong>7. Changes</strong></h3>
          <p>
            This legal notice may be updated to reflect technical or regulatory changes.<br />
            The date at the top indicates the latest version in effect.
          </p>

          <h3><strong>8. Contact</strong></h3>
          <p>For any inquiry, email raulcotrina@gmail.com</p>
        </div>

        <div className="pt-4">
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
