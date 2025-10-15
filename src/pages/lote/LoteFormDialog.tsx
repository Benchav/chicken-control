import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Lote } from "@/models/lote.model";
import { Status } from "@/models/status.model";
import { useLoteContext } from "@/contexts/LoteContext";

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  editingLote?: Lote | null;
}

export default function LoteFormDialog({ open, onOpenChange, editingLote }: Props) {
  const { addLote, updateLote } = useLoteContext();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nombre: "",
    cantidadInicial: "",
    fechaInicio: "",
    raza: "",
    observaciones: "",
  });

  useEffect(() => {
    if (editingLote) {
      setFormData({
        nombre: editingLote.nombre,
        cantidadInicial: editingLote.cantidadInicial.toString(),
        fechaInicio: editingLote.fechaInicio,
        raza: editingLote.raza,
        observaciones: editingLote.observaciones || "",
      });
    } else {
      setFormData({
        nombre: "",
        cantidadInicial: "",
        fechaInicio: "",
        raza: "",
        observaciones: "",
      });
    }
  }, [editingLote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: Lote = {
      id: editingLote ? editingLote.id : Date.now().toString(),
      nombre: formData.nombre,
      cantidadInicial: parseInt(formData.cantidadInicial),
      cantidadActual: parseInt(formData.cantidadInicial),
      fechaInicio: formData.fechaInicio,
      raza: formData.raza,
      estado: Status.ACTIVE,
      pesoPromedio: editingLote?.pesoPromedio || 0,
      mortalidad: editingLote?.mortalidad || 0,
      observaciones: formData.observaciones,
    };

    try {
      if (editingLote) {
        await updateLote(data);
        toast({ title: "Lote actualizado", description: "Datos actualizados exitosamente" });
      } else {
        await addLote(data);
        toast({ title: "Lote creado", description: "Nuevo lote agregado exitosamente" });
      }
      onOpenChange(false);
    } catch {
      toast({ title: "Error", description: "No se pudo guardar el lote", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingLote ? "Editar Lote" : "Crear Nuevo Lote"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nombre del Lote</Label>
              <Input
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Cantidad Inicial</Label>
              <Input
                type="number"
                value={formData.cantidadInicial}
                onChange={(e) => setFormData({ ...formData, cantidadInicial: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fecha de Inicio</Label>
              <Input
                type="date"
                value={formData.fechaInicio}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Raza</Label>
              <Select
                value={formData.raza}
                onValueChange={(value) => setFormData({ ...formData, raza: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar raza" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ross 308">Ross 308</SelectItem>
                  <SelectItem value="Cobb 500">Cobb 500</SelectItem>
                  <SelectItem value="Hubbard Classic">Hubbard Classic</SelectItem>
                  <SelectItem value="Arbor Acres">Arbor Acres</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Observaciones</Label>
            <Textarea
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{editingLote ? "Actualizar" : "Crear"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
