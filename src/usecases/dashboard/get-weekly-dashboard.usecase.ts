export class GetWeeklyDashboardUsecase { execute(userId: string) { return { userId, period: 'weekly', generatedAt: new Date() }; } }
