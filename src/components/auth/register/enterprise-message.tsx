import Link from "next/link";

const EnterpriseMessage = () => <div className="text-center w-full">
    <p className="text-sm md:text-lg text-muted text-nowrap">
        Use business email for{" "}
        <Link
            href="/auth/enterprise/MTech"
            className="text-primary underline"
        >
            Enterprise Account
        </Link>{" "}
        benefits
    </p>
</div>

export default EnterpriseMessage;
