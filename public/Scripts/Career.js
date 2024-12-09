class Career {
    constructor(config) {
        this.jobTitle = config.jobTitle;
        this.company = config.company;
        this.salary = config.salary;
        this.satisfaction = config.satisfaction || 50;
        this.yearsInPosition = 0;
        this.requirements = config.requirements || {};
    }

    static availableCareers = {
        retail: {
            jobTitle: "Retail Worker",
            company: "Local Store",
            salary: 25000,
            requirements: { age: 16, intelligence: 20 }
        },
        office: {
            jobTitle: "Office Clerk",
            company: "Corporate Inc",
            salary: 35000,
            requirements: { age: 18, intelligence: 40 }
        },
        teacher: {
            jobTitle: "Teacher",
            company: "Public School",
            salary: 45000,
            requirements: { age: 22, intelligence: 60 }
        },
        doctor: {
            jobTitle: "Doctor",
            company: "City Hospital",
            salary: 120000,
            requirements: { age: 26, intelligence: 85 }
        }
    };

    promote() {
        this.salary *= 1.1;
        this.satisfaction += 10;
        this.yearsInPosition = 0;
        return `You got promoted! Your new salary is ${Utils.formatMoney(this.salary)}`;
    }

    quitJob() {
        const severance = this.yearsInPosition > 5 ? this.salary * 0.3 : 0;
        return {
            message: `You quit your job${severance > 0 ? ' and received severance pay' : ''}!`,
            severance: severance
        };
    }

    yearlyUpdate() {
        this.yearsInPosition++;
        // Random satisfaction changes
        this.satisfaction = Math.max(0, Math.min(100, 
            this.satisfaction + Utils.randomInt(-10, 10)));
        
        // Small random salary adjustments
        this.salary *= (1 + Utils.randomInt(-2, 5) / 100);
        
        return {
            satisfaction: this.satisfaction,
            salary: this.salary
        };
    }
}