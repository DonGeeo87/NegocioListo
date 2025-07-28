import React from 'react';
import { Group } from '@mantine/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import StatWidget from './StatWidget';

const WidgetGrid = ({ widgets, onWidgetClick, onDragEnd }) => (
  <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="statWidgets" direction="vertical">
      {(provided) => (
        <div
          className="stats-grid"
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            margin: '0 auto 32px auto',
            maxWidth: 900,
            justifyItems: 'center',
            alignItems: 'center',
          }}
        >
          {widgets.map((widget, idx) => (
            <Draggable key={widget.key} draggableId={widget.key} index={idx}>
              {(dragProvided, dragSnapshot) => (
                <div
                  ref={dragProvided.innerRef}
                  {...dragProvided.draggableProps}
                  {...dragProvided.dragHandleProps}
                  style={{
                    ...dragProvided.draggableProps.style,
                    width: '100%',
                    maxWidth: 340,
                    minWidth: 260,
                    cursor: dragSnapshot.isDragging ? 'grabbing' : 'grab',
                  }}
                >
                  <StatWidget widget={widget} onClick={() => onWidgetClick(widget)} />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
);

export default WidgetGrid;
