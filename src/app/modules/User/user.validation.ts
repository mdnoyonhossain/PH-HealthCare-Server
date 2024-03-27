import { Gender, UserStatus } from "@prisma/client";
import { z } from "zod";

const createAdmin = z.object({
    password: z.string({ required_error: "Password is Required" }),
    admin: z.object({
        name: z.string({ required_error: "Name is Required" }),
        email: z.string({ required_error: "Email is Required" }),
        contactNumber: z.string({ required_error: "Email is Required" })
    })
});

const createDoctor = z.object({
    password: z.string({ required_error: "Password is Required" }),
    doctor: z.object({
        name: z.string({ required_error: "Name is Required" }),
        email: z.string({ required_error: "Email is Required" }),
        contactNumber: z.string({ required_error: "Email is Required" }),
        address: z.string().optional(),
        registrationNumber: z.string({ required_error: "Reg is Required" }),
        experience: z.number().optional(),
        gender: z.enum([Gender.MALE, Gender.FEMALE]),
        appointmentFee: z.number({ required_error: "Appointment Fee is Required" }),
        qualification: z.string({ required_error: "Qualification is Required" }),
        currentWorkingPlace: z.string({ required_error: "Current Working place is Required" }),
        designation: z.string({ required_error: "Designation is Required" })
    })
});

const createPatient = z.object({
    password: z.string(),
    patient: z.object({
        email: z.string({
            required_error: "Email is required!"
        }).email(),
        name: z.string({
            required_error: "Name is required!"
        }),
        contactNumber: z.string({
            required_error: "Contact number is required!"
        }),
        address: z.string({
            required_error: "Address is required"
        })
    })
});

const updateStatus = z.object({
    body: z.object({
        status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED])
    })
})

export const userValidation = {
    createAdmin,
    createDoctor,
    createPatient,
    updateStatus
}