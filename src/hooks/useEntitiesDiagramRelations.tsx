import { useMemo } from "react";
import * as models from "models";

export type EntityRelationsProps = {
  entities: models.AppCreateWithEntitiesEntityInput[];
};

export default function useEntitiesDiagramRelations({ entities }: EntityRelationsProps) {
  const relations = useMemo(() => {
    return entities.flatMap((entity, index) => {
      if (!entity.relationsToEntityIndex) return [];
      return entity.relationsToEntityIndex.map((relation) => ({
        key: `${index}_${relation}`,
        start: `entity${index}`,
        end: `entity${relation}`,
      }));
    });
  }, [entities]);

  const result = {
    relations
  };
  return result;
}
