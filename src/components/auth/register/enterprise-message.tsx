import Link from "next/link";

const EnterpriseMessage = () => <div className="w-full text-center">
    <p className="mx-auto text-sm md:text-lg text-muted text-nowrap">
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
