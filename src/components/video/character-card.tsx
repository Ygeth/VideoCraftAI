'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GenerateCharacterOutput } from "@/ai/flows/generate-character";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { VisuallyHidden } from "../ui/visually-hidden";

interface CharacterCardProps {
    character: GenerateCharacterOutput | null;
}

export function CharacterCard({ character }: CharacterCardProps) {
    if (!character) {
        return (
            <Card className="md:col-span-2 glass-card border-none bg-black/20 text-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="text-white/80" />
                        Personaje Principal
                    </CardTitle>
                    <CardDescription className="text-white/60">
                        Genera el personaje principal para tu historia.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-48 bg-white/5 border border-white/10 rounded-md">
                        <p className="text-white/40">No se ha generado ningún personaje aún.</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="md:col-span-2 glass-card border-none bg-black/20 text-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="text-white/80" />
                    {character.name}
                </CardTitle>
                <CardDescription className="text-white/60">
                    <div className="flex">
                        <div className="mr-4">
                            {character.imageDataUri && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div className="aspect-[1/1] w-auto h-52 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center relative overflow-hidden cursor-pointer hover:bg-white/10 transition-colors">
                                            <Image
                                                src={character.imageDataUri}
                                                alt={`Portrait of ${character.name}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl h-[90vh] glass border-white/10 bg-black/80">
                                        <VisuallyHidden>
                                            <DialogTitle>Character Preview</DialogTitle>
                                        </VisuallyHidden>
                                        <div className="w-full h-full relative">
                                            <Image
                                                src={character.imageDataUri}
                                                alt="Character Preview"
                                                fill
                                                className="object-contain rounded-lg"
                                            />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-2 text-white/90">Description:</h4>
                            <p className="text-white/70">{character.description}</p>
                        </div>
                    </div>
                </CardDescription>
            </CardHeader>
            {/* <CardContent className="space-y-4">            
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
      </CardContent> */}
        </Card>
    );
}
