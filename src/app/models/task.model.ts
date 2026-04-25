export interface Task {
id: number;
title: string;
userId: number;
assignedUserName: string;
statusId: number;
statusName: string;
createdAt: Date;
additionalInfo?: string;
priority?: string;
tags?: string;
}
