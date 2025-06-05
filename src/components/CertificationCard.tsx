import React from 'react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { BookCheck, Calendar, GraduationCap, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

export interface CertificationProps {
  title: string;
  issuer: string;
  date: string;
  skills: string[];
  thumbnail?: string;
  certificateImage?: string;
  url?: string;
  className?: string;
  style?: React.CSSProperties;
  link?: string;
  learnings?: string[];
}

const CertificationCard = ({ 
  title, 
  issuer, 
  date, 
  skills, 
  thumbnail, 
  certificateImage,
  url, 
  className, 
  style, 
  link, 
  learnings = [] 
}: CertificationProps) => {
  return (
    <Card className={cn(
      "h-full transition-all duration-500 hover:shadow-lg hovr:border-primary/20 overflow-hidden group relative",
      className
    )} style={style}>
      {/* Thumbnail with tags overlay */}
      {thumbnail && (
        <div className="relative h-32 w-full overflow-hidden">
          <img
            src={thumbnail}
            alt={`${title} by ${issuer}`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
            {skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{skills.length - 3}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Default View */}
      <div className="group-hover:opacity-0 transition-opacity duration-300 pb-16">
        <CardHeader className="py-3">
          <CardTitle className="line-clamp-2 text-base">{title}</CardTitle>
          <CardDescription className="flex items-center gap-1 text-sm">
            <span>{issuer}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="py-2 space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookCheck className="h-3 w-3" />
            <span>Certification</span>
          </div>
        </CardContent>
      </div>

      {/* Hover View */}
      {learnings.length > 0 && (
        <div className="absolute inset-0 bg-background opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col pb-16">
          <div className="flex items-center gap-2 text-primary mb-4">
            <GraduationCap className="h-5 w-5" />
            <h4 className="font-semibold">Ce que j'ai appris :</h4>
          </div>
          <ul className="space-y-2 flex-1">
            {learnings.map((learning, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{learning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Buttons - Fixed position */}
      <div className="absolute bottom-4 left-4 right-4 flex gap-2">
        {link && (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex-1"
          >
            <Button variant="outline" size="sm" className="w-full">
              Voir la formation
            </Button>
          </a>
        )}
        {certificateImage && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Certificat
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <img
                src={certificateImage}
                alt={`Certificat ${title} par ${issuer}`}
                className="w-full h-auto rounded-lg"
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Card>
  );
};

export default CertificationCard;
