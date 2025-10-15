'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GenerateCharacterOutput } from "@/ai/flows/generate-character";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface CharacterCardProps {
  character: GenerateCharacterOutput | null;
}

export function CharacterCard({ character }: CharacterCardProps) {
  if (!character) {
    return (
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User />
                    Personaje Principal
                </CardTitle>
                <CardDescription>
                    Genera el personaje principal para tu historia.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center h-48 bg-muted rounded-md">
                    <p className="text-muted-foreground">No se ha generado ningún personaje aún.</p>
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <User />
            {character.name}
        </CardTitle>
        <CardDescription>
            {character.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {character.imageDataUri && (
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                 <Image
                    src={character.imageDataUri}
                    alt={`Portrait of ${character.name}`}
                    fill
                    className="object-cover"
                />
            </div>
        )}
         <div>
            <h4 className="font-semibold text-sm mb-2">Clothing:</h4>
            <p className="text-sm text-muted-foreground">{character.clothing}</p>
        </div>
        <div>
            <h4 className="font-semibold text-sm mb-2">Skills:</h4>
            <div className="flex flex-wrap gap-2">
                {character.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
