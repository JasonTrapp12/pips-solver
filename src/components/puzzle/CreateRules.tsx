import { Box, Grid, MenuItem, Select, TextField, Stack } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useBoardStore } from "../../stores/BoardStore";
import { useEffect } from "react";

type FormValues = {
  groupRules: {
    groupId: string;
    operator: string;
    value: number;
  }[];
};

const CreateRules = () => {
  const { groups, setGroupRule, phase, nextRequested, completePhase } =
    useBoardStore();
  const { control, handleSubmit, register } = useForm<FormValues>({
    defaultValues: {
      groupRules: groups.map((g) => ({
        groupId: g.id,
        operator: "+",
        value: 0,
      })),
    },
  });

  useEffect(() => {
    console.log("here");
    if (!nextRequested) return;
    if (phase != "Creating Rules") return;
    handleSubmit((data) => {
      data.groupRules.forEach((groupRule) => {
        setGroupRule(groupRule.groupId, {
          operator: groupRule.operator,
          value: groupRule.value,
        });
      });
      completePhase();
    })();
  }, [nextRequested]);

  if (phase !== "Creating Rules") {
    return <></>;
  }

  return (
    <Stack
      sx={{
        borderRadius: 2,
        maxWidth: 600,
        mx: "auto",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          maxHeight: 220,
          overflowY: "auto",

          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0,0,0,0.4) transparent",

          "&::-webkit-scrollbar": {
            width: 8,
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: 4,
            border: "2px solid transparent",
            backgroundClip: "content-box",
          },
        }}
      >
        <form>
          {groups.map((group, index) => (
            <Grid
              container
              spacing={2}
              alignItems="center"
              key={group.id}
              sx={{ mb: 1, pl: 3 }}
            >
              <input
                type="hidden"
                {...register(`groupRules.${index}.groupId`)}
                value={group.id}
              />
              <Grid size={2}>
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    bgcolor: group.outlineColor,
                    borderRadius: "50%",
                    border: `1px solid #000`,
                  }}
                />
              </Grid>

              <Grid size={3}>
                <Controller
                  name={`groupRules.${index}.operator`}
                  control={control}
                  render={({ field }) => (
                    <Select fullWidth {...field}>
                      <MenuItem value="+">+</MenuItem>
                      <MenuItem value=">">{">"}</MenuItem>
                      <MenuItem value="<">{"<"}</MenuItem>
                      <MenuItem value="≠">≠</MenuItem>
                      <MenuItem value="=">=</MenuItem>
                    </Select>
                  )}
                />
              </Grid>

              <Grid size={5}>
                <Controller
                  name={`groupRules.${index}.value`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      type="number"
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              </Grid>
            </Grid>
          ))}
        </form>
      </Box>
    </Stack>
  );
};

export default CreateRules;
