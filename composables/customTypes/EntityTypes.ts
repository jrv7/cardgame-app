import {UserInterface} from "~/composables/entity/UserInterface";
import {EmployeeInterface} from "~/composables/entity/EmployeeInterface";
import {GoalInterface} from "~/composables/entity/GoalInterface";
import {CompanyAreaInterface} from "~/composables/entity/CompanyAreaInterface";
import {UploadedFileInterface} from "~/composables/entity/UploadedFileInterface";
import {JobPositionInterface} from "~/composables/entity/JobPositionInterface";
import {DepartmentInterface} from "~/composables/entity/DepartmentInterface";


export type DataEntityType = UserInterface |
    EmployeeInterface |
    GoalInterface |
    CompanyAreaInterface |
    JobPositionInterface |
    DepartmentInterface |
    UploadedFileInterface;