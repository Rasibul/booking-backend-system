export interface BookingInput {
    resource: string;
    startTime: Date;
    endTime: Date;
    requestedBy: string;
}
export interface GetBookingsFilter {
    resource?: string;
    date?: string;
}