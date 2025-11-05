import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-3xl font-bold text-center mb-2">
          Privacy Policy / Política de Privacidad
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Hermes takes privacy and responsible data handling very seriously.
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          {/* Spanish Version */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">🇪🇸 Política de Privacidad</h2>
            <p className="text-sm text-muted-foreground">Última actualización: noviembre de 2025</p>
            <p>
              Hermes es una aplicación experimental creada para ayudar a recruiters a interpretar perfiles técnicos y repositorios de GitHub.
              Nos tomamos muy en serio la privacidad y el tratamiento responsable de los datos.
            </p>

            <div className="space-y-4">
              <div>
                <p className="font-bold">1. Qué datos procesamos</p>
                <p>Los nombres de usuario y URLs de GitHub que introduces manualmente.</p>
                <p>Los resultados generados por la aplicación no se almacenan ni se asocian a ninguna identidad.</p>
              </div>

              <div>
                <p className="font-bold">2. Cómo usamos esa información</p>
                <p>Los datos se utilizan exclusivamente para generar un análisis mediante inteligencia artificial.</p>
                <p>No almacenamos, compartimos ni reutilizamos la información introducida.</p>
                <p>Los análisis se generan en tiempo real y se eliminan al finalizar la sesión.</p>
              </div>

              <div>
                <p className="font-bold">3. Quién procesa los datos</p>
                <p>El procesamiento técnico lo realiza Hermes, alojado en Render y Vercel.</p>
                <p>Si se utiliza análisis por IA, este se ejecuta a través del modelo Gemini de Google, conforme a sus propias políticas de privacidad.</p>
              </div>

              <div>
                <p className="font-bold">4. Tus derechos</p>
                <p>Puedes solicitar información o eliminación de cualquier dato relacionado con el uso del servicio escribiendo a:</p>
                <p>📧 raulcotrina@gmail.com</p>
              </div>

              <div>
                <p className="font-bold">5. Cookies y analítica</p>
                <p>Hermes no utiliza cookies ni herramientas de analítica que identifiquen a los usuarios.</p>
              </div>

              <div>
                <p className="font-bold">6. Actualizaciones</p>
                <p>Podremos actualizar esta política para reflejar cambios técnicos o legales.</p>
                <p>La fecha de actualización indica la última versión vigente.</p>
              </div>
            </div>
          </section>

          {/* English Version */}
          <section className="space-y-4 pt-8 border-t">
            <h2 className="text-2xl font-semibold">🇬🇧 Privacy Policy</h2>
            <p className="text-sm text-muted-foreground">Last updated: November 2025</p>
            <p>
              Hermes is an experimental application designed to help recruiters interpret GitHub profiles and technical repositories.
              We take privacy and responsible data handling very seriously.
            </p>

            <div className="space-y-4">
              <div>
                <p className="font-bold">1. Data we process</p>
                <p>GitHub usernames and URLs you manually provide.</p>
                <p>The generated results are not stored or linked to any identity.</p>
              </div>

              <div>
                <p className="font-bold">2. How we use this information</p>
                <p>Data is used solely to generate AI-based analyses.</p>
                <p>We do not store, share, or reuse any input data.</p>
                <p>Analyses are generated in real time and deleted after the session ends.</p>
              </div>

              <div>
                <p className="font-bold">3. Who processes your data</p>
                <p>Technical processing is handled by Hermes, hosted on Render and Vercel.</p>
                <p>If AI analysis is used, it's performed using Google's Gemini model under its own privacy terms.</p>
              </div>

              <div>
                <p className="font-bold">4. Your rights</p>
                <p>You can request information or deletion of any data related to the use of this service by contacting:</p>
                <p>📧 raulcotrina@gmail.com</p>
              </div>

              <div>
                <p className="font-bold">5. Cookies and analytics</p>
                <p>Hermes does not use cookies or analytics tools that identify users.</p>
              </div>

              <div>
                <p className="font-bold">6. Updates</p>
                <p>We may update this policy to reflect technical or legal changes.</p>
                <p>The update date indicates the latest version in effect.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="pt-8 flex justify-center">
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
