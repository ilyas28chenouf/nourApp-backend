export class GetRangeDashboardUsecase { execute(userId: string, from: string, to: string) { return { userId, period: 'range', from, to, generatedAt: new Date() }; } }
