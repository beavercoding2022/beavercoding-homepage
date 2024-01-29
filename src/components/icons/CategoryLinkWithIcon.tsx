import CategoryIcon from '@/src/components/icons/CategoryIcon';
import CustomLink from '@/src/components/ui/CustomLink';
import { Database } from '@/src/types_db';

export type CategoryLinkWithIconProps =
  Database['public']['Tables']['categories']['Row'] & { onlyIcon?: boolean };

export default function CategoryLinkWithIcon(props: CategoryLinkWithIconProps) {
  if (props?.onlyIcon) {
    return (
      <CustomLink href={`/c/${props.slug}`}>
        <CategoryIcon {...props} />
      </CustomLink>
    );
  }

  return (
    <CustomLink href={`/c/${props.slug}`}>
      {props.name}
      <CategoryIcon {...props} />
    </CustomLink>
  );
}
