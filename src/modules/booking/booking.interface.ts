export interface BookingInput {
    resource: string;
    startTime: Date;
    endTime: Date;
    requestedBy: string;
    status?: 'pending' | 'confirmed' | 'cancelled';
}
export interface GetBookingsFilter {
    resource?: string;
    date?: string;
}