import { ExternalLink, MapPin, Building, Users, Mail, Globe, Twitter, BookOpen, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { GitHubUser } from '@/utils/api';
import { formatDistanceToNow } from 'date-fns';

interface UserProfileProps {
  user: GitHubUser;
}

export function UserProfile({ user }: UserProfileProps) {
  const memberSince = new Date(user.created_at);
  const avatarUrl = `${user.html_url}.png`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Candidate Summary</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-foreground">
                <Info className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Overview of the developer's public GitHub profile including basic information, contact details, followers, and repository count.</p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4">
          <img
            src={avatarUrl}
            alt={`${user.name || user.login}'s avatar`}
            className="h-16 w-16 rounded-full border-2 border-border"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://github.com/identicons/${user.login}.png`;
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground">
              {user.name || user.login}
            </h3>
            <p className="text-sm text-muted-foreground">@{user.login}</p>
            
            {user.bio && (
              <p className="text-sm text-foreground mt-2 leading-relaxed">
                {user.bio}
              </p>
            )}
            
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.company && (
                <div className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  <span>{user.company}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{user.followers} followers</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <span>{user.public_repos} repos</span>
              </div>
            </div>
            
            {(user.email || user.blog || user.twitter_username) && (
              <div className="flex flex-wrap gap-3 mt-3">
                {user.email && (
                  <a
                    href={`mailto:${user.email}`}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail className="h-3 w-3" />
                    <span>{user.email}</span>
                  </a>
                )}
                {user.blog && (
                  <a
                    href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Globe className="h-3 w-3" />
                    <span>{user.blog}</span>
                  </a>
                )}
                {user.twitter_username && (
                  <a
                    href={`https://twitter.com/${user.twitter_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Twitter className="h-3 w-3" />
                    <span>@{user.twitter_username}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 border-t space-y-2">
          <p className="text-sm text-muted-foreground">
            Member since {formatDistanceToNow(memberSince, { addSuffix: true })}
          </p>
          <Button asChild variant="outline" className="w-full">
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View on GitHub
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}