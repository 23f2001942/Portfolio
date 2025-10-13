import { BookMarked, ExternalLink } from "lucide-react";
import Link from "next/link";
import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "@/components/section";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function LicensesSection() {
  const iitmCerts = portfolioData.licenses.filter(l => l.type === 'iitm');
  const moocCerts = portfolioData.licenses.filter(l => l.type === 'mooc');

  return (
    <Section
      id="licenses"
      title="Certifications"
      icon={<BookMarked className="h-8 w-8 text-primary" />}
    >
      <div className="space-y-6">
        {iitmCerts.length > 0 && (
          <div id="iitm-certifications" className="scroll-mt-24">
            <h3 className="text-xl font-semibold mb-4 text-primary">Indian Institute of Technology, Madras Certifications</h3>
            <Card>
              <CardContent className="p-4">
                <ul className="space-y-4">
                  {iitmCerts.map((license, index) => (
                    <li key={index}>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="font-semibold">{license.name}</p>
                            <p className="text-sm text-muted-foreground">{license.issuer}</p>
                          </div>
                          <p className="text-sm text-muted-foreground whitespace-nowrap">{license.date}</p>
                        </div>
                        {license.credentialUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={license.credentialUrl} target="_blank">
                              <ExternalLink />
                              Show Credential
                            </Link>
                          </Button>
                        )}
                        {license.credentialId && (
                           <p className="text-sm text-muted-foreground">Credential ID: {license.credentialId}</p>
                        )}
                      </div>
                      {index < iitmCerts.length - 1 && <Separator className="mt-4" />}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {moocCerts.length > 0 && (
           <div id="moocs" className="scroll-mt-24">
            <h3 className="text-xl font-semibold mb-4 text-primary">MOOCs</h3>
            <Card>
              <CardContent className="p-4">
                <ul className="space-y-4">
                  {moocCerts.map((license, index) => (
                    <li key={index}>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="font-semibold">{license.name}</p>
                            <p className="text-sm text-muted-foreground">{license.issuer}</p>
                          </div>
                          <p className="text-sm text-muted-foreground whitespace-nowrap">{license.date}</p>
                        </div>
                        {license.credentialUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={license.credentialUrl} target="_blank">
                              <ExternalLink />
                              Show Credential
                            </Link>
                          </Button>
                        )}
                        {license.credentialId && (
                           <p className="text-sm text-muted-foreground">Credential ID: {license.credentialId}</p>
                        )}
                      </div>
                      {index < moocCerts.length - 1 && <Separator className="mt-4" />}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Section>
  );
}
