'use client'
import React, { useState } from 'react';
import { Info, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronRight } from 'lucide-react';

interface AlertBoxProps {
  type: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export default function AlertBox({
  type,
  title,
  children,
  collapsible = false,
  defaultOpen = true
}: AlertBoxProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const getIcon = () => {
    const iconMap: Record<'info' | 'warning' | 'success' | 'error', React.ReactNode> = {
      info: <Info className="h-6 w-6 text-blue-600" />,
      warning: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
      success: <CheckCircle className="h-6 w-6 text-green-600" />,
      error: <XCircle className="h-6 w-6 text-red-600" />
    };
    return iconMap[type];
  };

  const getStyles = () => {
    const styleMap: Record<'info' | 'warning' | 'success' | 'error', {
      container: string;
      icon: string;
      title: string;
    }> = {
      info: {
        container: 'bg-blue-50 border-l-4 border-blue-500 text-blue-800',
        icon: 'text-blue-600',
        title: 'text-blue-900'
      },
      warning: {
        container: 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800',
        icon: 'text-yellow-600',
        title: 'text-yellow-900'
      },
      success: {
        container: 'bg-green-50 border-l-4 border-green-500 text-green-800',
        icon: 'text-green-600',
        title: 'text-green-900'
      },
      error: {
        container: 'bg-red-50 border-l-4 border-red-500 text-red-800',
        icon: 'text-red-600',
        title: 'text-red-900'
      }
    };
    return styleMap[type];
  };

  const styles = getStyles();

  return (
    <div className={`border rounded-lg p-4 my-4 ${styles.container}`} role="alert">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0" aria-hidden="true">
          {getIcon()}
        </div>
        <div className="flex-1">
          {(title || collapsible) && (
            <div
              className={`flex items-center justify-between ${collapsible ? 'cursor-pointer' : ''}`}
              onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
              aria-expanded={isOpen}
              aria-controls={`alert-content-${type}`}
            >
              <h4 className={`font-semibold ${styles.title}`} id={`alert-title-${type}`}>
                {title || `${type.charAt(0).toUpperCase() + type.slice(1)}`}
              </h4>
              {collapsible && (
                <div className={`${styles.icon}`}>
                  {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </div>
              )}
            </div>
          )}
          {(!collapsible || isOpen) && (
            <div
              className={`${title || collapsible ? 'mt-2' : ''}`}
              id={`alert-content-${type}`}
              aria-labelledby={`alert-title-${type}`}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}