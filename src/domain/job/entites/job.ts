// Express API request DTO
export class JobModel {
    constructor(
        public jobOwner: string = "",
        public location: string = "",
        public address: string = "",
        public date: Date = new Date(),
        public numberOfApplicants: string = "",
        public fromTime: string = "",
        public toTime: string = "",
        public jobType: string = "",
        public clientEmail: string = "",
        public clientPhoneNumber: string = "",
        public feeType: string = "",
        public fee: string = "",
        public description: string = "",
        public attachments: string[] = [],
        public applyBy: Date = new Date(),
        public createdAt: Date | undefined = undefined
    ) { }
}

// Job Entity provided by Job Repository is converted to Express API Response
export class JobEntity {
    constructor(
        public id: string | undefined = undefined,
        public jobOwner: string,
        public location: string,
        public address: string,
        public date: Date,
        public numberOfApplicants: string,
        public fromTime: string,
        public toTime: string,
        public jobType: string,
        public clientEmail: string,
        public clientPhoneNumber: string,
        public feeType: string,
        public fee: string,
        public description: string,
        public attachments: string[],
        public applyBy: Date,
        public createdAt: Date | undefined = undefined
    ) { }
}

export class JobMapper {
    static toEntity(
        jobData: any,
        includeId?: boolean,
        existingJob?: JobEntity
    ): JobEntity {
        if (existingJob != null) {
            // If existingJob is provided, merge the data from jobData with the existingJob
            return {
                ...existingJob,
                jobOwner: jobData.jobOwner !== undefined ? jobData.jobOwner : existingJob.jobOwner,
                location: jobData.location !== undefined ? jobData.location : existingJob.location,
                address: jobData.address !== undefined ? jobData.address : existingJob.address,
                date: jobData.date !== undefined ? jobData.date : existingJob.date,
                numberOfApplicants: jobData.numberOfApplicants !== undefined ? jobData.numberOfApplicants : existingJob.numberOfApplicants,
                fromTime: jobData.fromTime !== undefined ? jobData.fromTime : existingJob.fromTime,
                toTime: jobData.toTime !== undefined ? jobData.toTime : existingJob.toTime,
                jobType: jobData.jobType !== undefined ? jobData.jobType : existingJob.jobType,
                clientEmail: jobData.clientEmail !== undefined ? jobData.clientEmail : existingJob.clientEmail,
                clientPhoneNumber: jobData.clientPhoneNumber !== undefined ? jobData.clientPhoneNumber : existingJob.clientPhoneNumber,
                feeType: jobData.feeType !== undefined ? jobData.feeType : existingJob.feeType,
                fee: jobData.fee !== undefined ? jobData.fee : existingJob.fee,
                description: jobData.description !== undefined ? jobData.description : existingJob.description,
                attachments: jobData.attachments !== undefined ? jobData.attachments : existingJob.attachments,
                applyBy: jobData.applyBy !== undefined ? jobData.applyBy : existingJob.applyBy,
                createdAt: jobData.createdAt !== undefined ? jobData.createdAt : existingJob.createdAt,
            };
        } else {
            // If existingJob is not provided, create a new JobEntity using jobData
            const jobEntity: JobEntity = {
                id: includeId ? jobData.id ? jobData.id.toString(): undefined : jobData.id,
                jobOwner: jobData.jobOwner,
                location: jobData.location,
                address: jobData.address,
                date: jobData.date,
                numberOfApplicants: jobData.numberOfApplicants,
                fromTime: jobData.fromTime,
                toTime: jobData.toTime,
                jobType: jobData.jobType,
                clientEmail: jobData.clientEmail,
                clientPhoneNumber: jobData.clientPhoneNumber,
                feeType: jobData.feeType,
                fee: jobData.fee,
                description: jobData.description,
                attachments: jobData.attachments,
                applyBy: jobData.applyBy,
                createdAt: jobData.createdAt,
            };
            return jobEntity;
        }
    }

    static toModel(job: JobEntity): any {
        return {
            id: job.id,
            jobOwner: job.jobOwner,
            location: job.location,
            address: job.address,
            date: job.date,
            numberOfApplicants: job.numberOfApplicants,
            fromTime: job.fromTime,
            toTime: job.toTime,
            jobType: job.jobType,
            clientEmail: job.clientEmail,
            clientPhoneNumber: job.clientPhoneNumber,
            feeType: job.feeType,
            fee: job.fee,
            description: job.description,
            attachments: job.attachments,
            applyBy: job.applyBy,
            createdAt: job.createdAt,
        };
    }
}
