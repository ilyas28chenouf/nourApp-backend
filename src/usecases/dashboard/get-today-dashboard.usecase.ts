export class GetTodayDashboardUsecase { execute(userId: string) { return { userId, period: 'today', generatedAt: new Date() }; } }
