import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Link } from 'react-router';
import { DownloadIcon, ShareIcon, TrashIcon } from 'lucide-react';

/**
 * UX Enhancement Components
 */

/**
 * Empty State Component
 * Shows a friendly message when there's no data
 */
export const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="text-6xl mb-4 opacity-50">{icon}</div>
    <h3 className="text-2xl font-bold mb-2 text-gray-900">{title}</h3>
    <p className="text-gray-600 mb-6 max-w-md">{description}</p>
    {action && (
      <Button asChild>
        <Link to={action.href}>{action.label}</Link>
      </Button>
    )}
  </div>
);

/**
 * Quick Stats Component
 * Display key metrics at a glance
 */
export const QuickStats: React.FC<{
  stats: Array<{
    label: string;
    value: string | number;
    trend?: 'up' | 'down' | 'neutral';
  }>;
}> = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {stats.map((stat, index) => (
      <Card key={index}>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-600">{stat.label}</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            {stat.trend && (
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  stat.trend === 'up'
                    ? 'bg-green-100 text-green-800'
                    : stat.trend === 'down'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

/**
 * Action Menu Component
 * Quick actions for resume items
 */
export const ResomeActionMenu: React.FC<{
  resumeId: string;
  onDownload?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
}> = ({ resumeId, onDownload, onShare, onDelete }) => (
  <div className="flex gap-2">
    {onDownload && (
      <Button
        variant="outline"
        size="sm"
        onClick={onDownload}
        aria-label="Download resume"
        title="Download resume"
      >
        <DownloadIcon className="w-4 h-4" />
      </Button>
    )}
    {onShare && (
      <Button
        variant="outline"
        size="sm"
        onClick={onShare}
        aria-label="Share resume"
        title="Share resume"
      >
        <ShareIcon className="w-4 h-4" />
      </Button>
    )}
    {onDelete && (
      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        className="text-red-600 hover:text-red-700"
        aria-label="Delete resume"
        title="Delete resume"
      >
        <TrashIcon className="w-4 h-4" />
      </Button>
    )}
  </div>
);

/**
 * Progress Indicator Component
 * Shows multi-step progress
 */
export const ProgressIndicator: React.FC<{
  steps: string[];
  currentStep: number;
}> = ({ steps, currentStep }) => (
  <div className="flex items-center justify-between mb-8">
    {steps.map((step, index) => (
      <React.Fragment key={step}>
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
            index < currentStep
              ? 'bg-green-500 text-white'
              : index === currentStep
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-gray-600'
          }`}
        >
          {index < currentStep ? '✓' : index + 1}
        </div>
        {index < steps.length - 1 && (
          <div
            className={`flex-1 h-1 mx-2 rounded ${
              index < currentStep ? 'bg-green-500' : 'bg-gray-300'
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

/**
 * Feature Highlight Component
 * Highlight key features or benefits
 */
export const FeatureHighlight: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
    <div className="text-4xl mb-3">{icon}</div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

/**
 * Success Message Component
 * Show success feedback
 */
export const SuccessMessage: React.FC<{
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}> = ({ title, description, action }) => (
  <div className="rounded-lg border border-green-200 bg-green-50 p-6">
    <div className="flex items-start gap-4">
      <div className="text-2xl">✓</div>
      <div className="flex-1">
        <h3 className="font-semibold text-green-900">{title}</h3>
        {description && (
          <p className="text-green-800 text-sm mt-1">{description}</p>
        )}
        {action && (
          <Button
            onClick={action.onClick}
            className="mt-4"
            variant="outline"
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  </div>
);
