import styled from "styled-components";
import { color } from "metabase/lib/colors";
import { space } from "metabase/styled-components/theme";
import Icon from "metabase/components/Icon";

export const JoinClausesContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
`;

export const JoinClauseContainer = styled.div`
  margin-bottom: ${props => (props.isLast ? 0 : "2px")};
`;

export const JoinClauseRoot = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 auto;
`;

export const JoinStrategyIcon = styled(Icon).attrs({ size: 32 })`
  color: ${color("brand")};
  margin-right: ${space(1)};
`;

export const JoinTypeSelectRoot = styled.div`
  margin: ${space(1)} ${space(1)} 0 ${space(1)};
`;

export const JoinTypeOptionRoot = styled.div`
  display: flex;
  align-items: center;
  padding: ${space(1)};
  margin-bottom: ${space(1)};
  cursor: pointer;
  border-radius: ${space(1)};

  color: ${props => props.isSelected && color("text-white")};
  background-color: ${props => props.isSelected && color("brand")};

  :hover {
    color: ${color("text-white")};
    background-color: ${color("brand")};

    .Icon {
      color: ${color("text-white")};
    }
  }
`;

export const JoinTypeIcon = styled(Icon).attrs({ size: 24 })`
  margin-right: ${space(1)};
  color: ${props => (props.isSelected ? color("text-white") : color("brand"))};
`;

export const JoinedTableControlRoot = styled.div`
  display: flex;
  align-items: center;
`;
