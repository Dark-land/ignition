'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, Code, FileJson } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface JsonTreeViewerProps {
  data: unknown
  className?: string
}

type ViewMode = 'tree' | 'raw'

export function JsonTreeViewer({ data, className }: JsonTreeViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('tree')
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-secondary border-b border-border">
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <FileJson className="w-4 h-4" />
          <span>JSON Response</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('tree')}
            className={cn(
              'h-7 px-2 text-xs',
              viewMode === 'tree' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'
            )}
          >
            Tree
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('raw')}
            className={cn(
              'h-7 px-2 text-xs',
              viewMode === 'raw' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'
            )}
          >
            <Code className="w-3 h-3 mr-1" />
            Raw
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-3 overflow-x-auto max-h-96 overflow-y-auto">
        {viewMode === 'tree' ? (
          <JsonNode data={data} name="root" isRoot />
        ) : (
          <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}

interface JsonNodeProps {
  data: unknown
  name: string
  isRoot?: boolean
  depth?: number
}

function JsonNode({ data, name, isRoot = false, depth = 0 }: JsonNodeProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 2)
  
  const type = getType(data)
  const isExpandable = type === 'object' || type === 'array'
  
  const toggleExpand = () => {
    if (isExpandable) {
      setIsExpanded(!isExpanded)
    }
  }
  
  const renderValue = () => {
    switch (type) {
      case 'string':
        return <span className="text-json-string">{`"${data}"`}</span>
      case 'number':
        return <span className="text-json-number">{String(data)}</span>
      case 'boolean':
        return <span className="text-json-boolean">{String(data)}</span>
      case 'null':
        return <span className="text-json-null">null</span>
      case 'array':
        return <span className="text-muted-foreground">{`Array(${(data as unknown[]).length})`}</span>
      case 'object':
        return <span className="text-muted-foreground">{`{${Object.keys(data as object).length}}`}</span>
      default:
        return <span className="text-foreground">{String(data)}</span>
    }
  }
  
  const renderChildren = () => {
    if (!isExpanded) return null
    
    if (type === 'array') {
      return (data as unknown[]).map((item, index) => (
        <JsonNode 
          key={index} 
          data={item} 
          name={String(index)} 
          depth={depth + 1}
        />
      ))
    }
    
    if (type === 'object') {
      return Object.entries(data as object).map(([key, value]) => (
        <JsonNode 
          key={key} 
          data={value} 
          name={key} 
          depth={depth + 1}
        />
      ))
    }
    
    return null
  }
  
  return (
    <div className="font-mono text-xs">
      <div 
        className={cn(
          'flex items-center gap-1 py-0.5 rounded hover:bg-surface-hover cursor-default',
          isExpandable && 'cursor-pointer'
        )}
        onClick={toggleExpand}
        style={{ paddingLeft: isRoot ? 0 : depth * 16 }}
      >
        {isExpandable && (
          <span className="text-muted-foreground w-4">
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </span>
        )}
        {!isExpandable && <span className="w-4" />}
        
        {!isRoot && (
          <>
            <span className="text-json-key">{name}</span>
            <span className="text-muted-foreground">:</span>
          </>
        )}
        
        {(!isExpandable || !isExpanded) && (
          <span className="ml-1">{renderValue()}</span>
        )}
        
        {isExpandable && isExpanded && (
          <span className="text-muted-foreground ml-1">
            {type === 'array' ? '[' : '{'}
          </span>
        )}
      </div>
      
      {isExpanded && isExpandable && (
        <>
          {renderChildren()}
          <div 
            className="text-muted-foreground py-0.5"
            style={{ paddingLeft: isRoot ? 0 : depth * 16 }}
          >
            {type === 'array' ? ']' : '}'}
          </div>
        </>
      )}
    </div>
  )
}

function getType(value: unknown): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value
}
