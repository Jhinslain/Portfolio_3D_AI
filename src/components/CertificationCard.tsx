
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
}

const CertificationCard = ({ title, issuer, date, skills, image, url, className, style }: CertificationProps) => {
  return (
    <Card className={`h-full transition-all duration-300 hover:shadow-lg hover:border-primary/20 overflow-hidden ${className || ''}`} style={style}>
      <div className="relative">
        {image && (
          <div className="relative h-40 w-full overflow-hidden">
            <img
              src={image}
              alt={`${title} by ${issuer}`}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <span>{issuer}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookCheck className="h-4 w-4" />
          <span>Certification</span>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-wrap gap-2">
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
};

export default CertificationCard;
