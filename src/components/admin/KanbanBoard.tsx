import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import api from '../../config/axios';
import { useTheme } from '../../context/ThemeContext';
import { palette } from '../../styles/adminTheme';

interface KanbanBoardProps {
    campaignId: number;
}

export default function KanbanBoard({ campaignId }: KanbanBoardProps) {
    const { isDark } = useTheme();
    const p = isDark ? palette.dark : palette.light;
    const [tasks, setTasks] = useState<any[]>([]);

    useEffect(() => {
        if (campaignId) fetchTasks();
    }, [campaignId]);

    const fetchTasks = async () => {
        try {
            const res = await api.get(`/campaigns/${campaignId}/tasks`);
            setTasks(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        // Tìm task
        const taskToMove = tasks.find(t => t.id.toString() === draggableId);
        if (!taskToMove) return;

        const newStatus = destination.droppableId;
        
        // Cập nhật UI ngay lập tức
        const newTasks = Array.from(tasks);
        const index = newTasks.findIndex(t => t.id.toString() === draggableId);
        newTasks[index] = { ...taskToMove, status: newStatus };
        setTasks(newTasks);

        // Gọi API cập nhật DB
        try {
            await api.patch(`/campaigns/tasks/${draggableId}/status`, { status: newStatus });
        } catch (error) {
            alert('Lỗi cập nhật trạng thái');
            fetchTasks(); // rollback nếu lỗi
        }
    };

    const getColumnTasks = (status: string) => tasks.filter(t => t.status === status);

    const columns = [
        { id: 'TODO', title: 'Cần làm (To Do)', color: '#f59e0b' },
        { id: 'DOING', title: 'Đang làm (In Progress)', color: '#3b82f6' },
        { id: 'DONE', title: 'Hoàn thành (Done)', color: '#10b981' }
    ];

    return (
        <div style={{ marginTop: '20px' }}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {columns.map(col => (
                        <div key={col.id} style={{
                            backgroundColor: p.surfaceAlt,
                            borderRadius: '8px',
                            border: `1px solid ${p.border}`,
                            padding: '12px',
                            minHeight: '400px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div style={{
                                fontWeight: 600, fontSize: '14px', marginBottom: '16px', color: col.color,
                                paddingBottom: '8px', borderBottom: `2px solid ${col.color}`
                            }}>
                                {col.title} ({getColumnTasks(col.id).length})
                            </div>

                            <Droppable droppableId={col.id}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}
                                    >
                                        {getColumnTasks(col.id).map((task, index) => (
                                            <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            backgroundColor: p.surface,
                                                            padding: '12px',
                                                            borderRadius: '6px',
                                                            border: `1px solid ${p.border}`,
                                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                            ...provided.draggableProps.style
                                                        }}
                                                    >
                                                        <div style={{ fontWeight: 600, fontSize: '13px', color: p.text, marginBottom: '4px' }}>
                                                            {task.taskName}
                                                        </div>
                                                        {task.description && (
                                                            <div style={{ fontSize: '12px', color: p.textFaint, marginBottom: '8px' }}>
                                                                {task.description}
                                                            </div>
                                                        )}
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            {task.registration?.user?.avatar ? (
                                                                <img src={`http://localhost:5000${task.registration.user.avatar}`} alt="avatar" style={{ width: 20, height: 20, borderRadius: '50%' }} />
                                                            ) : (
                                                                <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                                                                    {task.registration?.user?.fullName?.charAt(0)}
                                                                </div>
                                                            )}
                                                            <span style={{ fontSize: '11px', color: p.textSub }}>{task.registration?.user?.fullName}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
