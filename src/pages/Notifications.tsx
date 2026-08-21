import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { PageHeader } from '../components/analytics/PageHeader';
import { PrototypeNotice } from '../components/analytics/Notices';
import { useAnalysis } from '../contexts/AnalysisContext';
import { notificationKindLabels, notifications } from '../data/notifications';

export function Notifications() {
  const navigate = useNavigate();
  const { readNotifications, markNotificationRead } = useAnalysis();

  return (
    <div className="space-y-5">
      <PageHeader
        title="تغییرات مهم"
        description="فقط تغییرهایی را اطلاع می‌دهیم که ارزش بررسی دارند." />
      

      <ul className="space-y-3">
        {notifications.map((item) => {
          const isRead = readNotifications.includes(item.id);
          return (
            <li key={item.id}>
              <Card
                padding="md"
                elevation="flat"
                className={isRead ? 'border-border-light' : 'border-pal-200 bg-pal-50'}>
                
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={isRead ? 'neutral' : 'brand'} size="sm">
                    {notificationKindLabels[item.kind]}
                  </Badge>
                  <span className="text-[11px] text-gray-700">{item.date}</span>
                  {isRead &&
                  <span className="ms-auto text-[11px] text-gray-600">بررسی‌شده</span>
                  }
                </div>
                <h2 className="mt-2 text-[14px] font-bold text-gray-950">{item.title}</h2>
                <p className="mt-1 text-[13px] leading-7 text-gray-800">{item.body}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => navigate(`/insights/${item.insightId}`)}>
                    بررسی یافته
                  </Button>
                  {!isRead &&
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markNotificationRead(item.id)}>
                    
                      علامت‌گذاری به‌عنوان بررسی‌شده
                    </Button>
                  }
                </div>
              </Card>
            </li>);

        })}
      </ul>

      <PrototypeNotice />
    </div>);

}