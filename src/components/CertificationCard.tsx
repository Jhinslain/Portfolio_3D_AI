import React from 'react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { BookCheck, Calendar } from 'lucide-react';

export interface CertificationProps {
  title: string;
  issuer: string;
  date: string;
  skills: string[];
  image?: string;
  url?: string;
  className?: string;
  style?: React.CSSProperties;
  link?: string;
}

const CertificationCard = ({ title, issuer, date, skills, image, url, className, style, link }: CertificationProps) => {
  const cardContent = (
    <Card className={`h-full transition-all duration-300 hover:shadow-lg hover:border-primary/20 overflow-hidden ${className || ''}`} style={style}>
      <div className="relative">
        {image && (
          <div className="relative h-32 w-full overflow-hidden">
            <img
              src={image}
              alt={`${title} by ${issuer}`}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
        )}
      </div>
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
      <CardFooter className="py-2">
        <div className="flex flex-wrap gap-1">
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
      </CardFooter>
    </Card>
  );

  if (link) {
    return (
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block h-full"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
};

export default CertificationCard;
