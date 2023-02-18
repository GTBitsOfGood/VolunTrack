import dbConnect from "../mongodb/index";
import Organization from "../mongodb/models/organization";

export async function createOrganization({organization_name, website_url, contact_name, contact_email, contact_phone, admin_email, organization_code}) {
    await dbConnect();
    console.log(organization_name)

    const result = await Organization.create({
        name: organization_name,
        website: website_url,
        slug: organization_code,
        defaultContactName: contact_name,
        defaultContactEmail: contact_email,
        defaultContactPhone: contact_phone,
        orginalAdminEmail: admin_email,
        active: false,
    });

    return {status:200, message: result}
}